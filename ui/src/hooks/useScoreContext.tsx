import React, {RefObject, useContext, useEffect, useMemo, useState} from 'react';
import {Note} from "../model/Note.ts";
import {durationToScalar, EmptyScore, getPositionRange, getPositions, isEmpty, sort} from "../utils/helpers.tsx";
import {Score} from "../model/Score.ts";
import {StaveDimensions} from "../model/Dimensions.ts";
import {HalfPosition} from "../model/HalfPosition.ts";
import {Range} from "../model/Range.ts";
import {useAudioContext} from "./useAudioContext.tsx";
import {DefaultVoices} from "../utils/dictionaries.ts";
import {calculateStaveDimensions, getOffset, isInsideLoop} from "../utils/calculation.helpers.tsx";
import {Layout, Playback} from "../utils/constants.ts";
import {Voice, VoiceType} from "../model/Voice.ts";
import useCursorCoords from "./useCursorCoords.tsx";
import {ScoreContext} from "../context/ScoreContext.tsx";

interface Properties {
    children: React.ReactNode;
}

export const ScoreContextProvider: React.FC<Properties> = ({children}) => {

    const audioContext = useAudioContext();

    const [score, setScore] = useState<Score>(structuredClone(EmptyScore));

    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [isSimplifiedMode, setIsSimplifiedMode] = useState<boolean>(false);
    const [isExportMode, setIsExportMode] = useState<boolean>(false);
    const [isTypeMode, setIsTypeMode] = useState<boolean>(false);

    const [containerRef, setContainerRef] = useState<RefObject<HTMLElement> | undefined>();
    const [svgRef, setSvgRef] = useState<RefObject<SVGSVGElement> | undefined>();

    const [loopRange, setLoopRange] = useState<Range | undefined>();
    const [activePosition, setActivePosition] = useState<number>(-1);
    const [activeDuration, setActiveDuration] = useState<string>("8n");
    const [activeVoice, setActiveVoice] = useState<string>(DefaultVoices[0].name);

    const activate = (position: number) => {
        const notes = getNotes(position);
        if (notes.length) {
            audioContext.stopPlayback();
            audioContext.playNotes(notes, score.data.stave);
            if (["2n", "4n", "8n"].includes(notes[0].duration as string)) {
                setActiveDuration(notes[0].duration)
            }
        }
        setActivePosition(position);
        if (!isInsideLoop(position, loopRange)) {
            setLoopRange(undefined);
        }
        scrollToPosition(position)
    }

    const updateLoopRange = (start: number, end: number) => {
        if (end < start) {
            setLoopRange({start: Math.max(end, 0), end: start});
            return;
        }
        setLoopRange({start: Math.max(start, 0), end: end});
    }

    const scrollToPosition = (position: number) => {
        if (containerRef?.current) {
            const offset = getOffset(position, context.score.data.breaks, context.dimensions);
            const x = position * Layout.stave.note.SPACING - offset.x;

            // todo should be dynamic, but these seem to more or less work for the time being
            const X_OFFSET = 150;
            const Y_OFFSET = 100;

            if (containerRef.current.offsetWidth < (x + containerRef.current.scrollLeft + X_OFFSET) ||
                containerRef.current.scrollLeft > x) {
                containerRef.current.scrollTo({
                    left: x,
                    behavior: 'smooth'
                });
            }

            const y = containerRef.current.offsetTop + offset.y + window.scrollY;
            if (window.innerHeight < y + Y_OFFSET) {
                const scrollTo = offset.y + containerRef.current.offsetTop - Layout.stave.container.SYMBOLS_BAR - 35;
                window.scrollTo({
                    top: scrollTo,
                    behavior: 'smooth'
                });
            }
        }
    };

    const next = () => {
        // todo take half positions into account (currently they are skipped... or are they?)
        let position: number;
        if (isEditMode) {
            const note = getNote(activePosition, activeVoice);
            position = note
                ? note.position + durationToScalar(note.duration)
                : activePosition + 1;
        } else {
            const positions = getPositions(score.data.voices.filter(v => !v.muted));
            const currentPositionIndex = positions.findIndex(p => p === activePosition);
            position = positions[Math.min(currentPositionIndex + 1, positions.length - 1)];
        }
        activate(position);
    }

    const previous = () => {
        let position: number;
        if (isEditMode) {
            const closestNote: Note | undefined = score.data.voices
                .filter(v => !v.muted)
                .flatMap(v => v.notes)
                .filter(n => n.position < activePosition)
                .slice(-1)?.[0];

            if (closestNote && (closestNote.position + durationToScalar(closestNote.duration)) > (activePosition - 1)) {
                position = closestNote.position;
            } else {
                position = Math.max(activePosition - 1, 0);
            }
        } else {
            const positions = getPositions(score.data.voices);
            const currentPositionIndex = positions.findIndex(p => p === activePosition);
            position = positions[Math.max(currentPositionIndex - 1, 0)];
        }
        activate(position);
    }

    const getNotes = (position: number, voice?: Voice): Note[] => {
        const notes = score.data.voices
            .filter(v => !v.muted && (!voice || v.name === voice.name))
            .flatMap(v => v.notes) || [];
        return notes.filter(n => n.position === position);
    }

    const getNote = (position: number, voiceName?: string): Note | undefined => {
        const notes = voiceName
            ? score.data.voices.find(v => v.name === voiceName)?.notes || []
            : score.data.voices.filter(v => !v.muted).flatMap(v => v.notes) || [];
        return notes.find(n => n.position === position);
    }

    const refresh = () => {
        setScore({...score});
    }

    const activeNote = useMemo(() => {
        if (!activeVoice) {
            return undefined;
        }
        return getNote(activePosition, activeVoice);
    }, [score, activePosition, activeVoice]);

    const endPosition: number = useMemo<number>(() => {
        const notes = score.data.voices.flatMap(v => v.notes).sort((a, b) => a.position - b.position);
        const lyrics = score.data.lyrics.sort((a, b) => a.position - b.position);
        const lastNote = notes.slice(-1).pop();
        const lastLyric = lyrics.slice(-1).pop();

        return Math.max(lastLyric?.position || 0, ((lastNote?.position || 0) + (lastNote?.duration ? durationToScalar(lastNote.duration) : 0)));
    }, [score]);

    const dimensions: StaveDimensions = useMemo<StaveDimensions>(
        () => calculateStaveDimensions(score), [score, score.data.breaks, score.data.voices]);

    const halfPositions: HalfPosition[] = useMemo(() => {
        const sixteenthNotes = score.data.voices
            .find(v => v.name === activeVoice)?.notes
            .filter(n => n.duration === "16n") || [];
        if (sixteenthNotes.length) {
            return sixteenthNotes
                .map(n => ({
                    position: n.position,
                    cutoffCoordStart: (n.position + 0.75) * Layout.stave.note.SPACING,
                    cutoffCoordEnd: (n.position + 1.25) * Layout.stave.note.SPACING
                }));
        }
        return [];
    }, [score, activeVoice, activeDuration]);

    const duplicateNoteKeys: string[] = useMemo<string[]>(() => {
        const duplicates = new Set<string>();
        const seen = new Set<string>();

        score.data.voices
            .filter(v => isEditMode || !v.muted)
            .forEach(v => {
                v.notes.forEach(n => {
                    const key = `${n.position}-${n.pitch}-${v.type === VoiceType.BOTTOM_TORRO ? VoiceType.TORRO : v.type}`;
                    if (seen.has(key)) {
                        duplicates.add(`${key}-${v.name}`);
                    } else {
                        seen.add(key);
                    }
                });
            });
        return Array.from(duplicates);
    }, [score, isEditMode, score.data.voices, activeVoice]);

    const cursorCoords = useCursorCoords(containerRef, dimensions, halfPositions);

    const cursorPosition = useMemo(() => {
        let position = cursorCoords.x + (score.data.breaks[cursorCoords.y - 1] || 0);
        if (position > score.data.breaks[cursorCoords.y]) {
            position = -1;
        }
        return position;
    }, [cursorCoords.x, cursorCoords.y]);

    useEffect(() => {
        audioContext.setTempo(score.defaultTempo || Playback.DEFAULT_TEMPO);
        audioContext.setTransposition(score.defaultTransposition || Playback.DEFAULT_TRANSPOSITION);
    }, [score.defaultTempo, score.defaultTransposition]);

    useEffect(() => {
        const voice = score.data.voices.find(v => v.name === activeVoice);
        if (voice) {
            let occupiedPositions: number[] = [];
            voice.notes.forEach(n => {
                occupiedPositions = occupiedPositions.concat(getPositionRange(n));
            });
            voice.occupiedPositions = sort(Array.from(new Set(occupiedPositions)));
        }
        refresh();
    }, [score.data.voices, activeVoice, activeDuration]);


    const context = useMemo(() => ({
        score, setScore,

        isEditMode, setIsEditMode,
        isSimplifiedMode, setIsSimplifiedMode,
        isExportMode, setIsExportMode,
        isTypeMode, setIsTypeMode,

        activate,
        next,
        previous,

        activeNote,
        loopRange, setLoopRange, updateLoopRange,
        activeDuration, setActiveDuration,
        activePosition, setActivePosition,
        activeVoice, setActiveVoice,
        cursorPosition,

        getNote,
        getNotes,
        scrollToPosition,

        refresh,

        duplicateNoteKeys,
        halfPositions,
        dimensions,
        endPosition,

        containerRef, setContainerRef,
        svgRef, setSvgRef

    }), [containerRef, endPosition, isEditMode, isExportMode, isTypeMode, dimensions, score,
        activeNote, activePosition, activeVoice, activeDuration, endPosition, cursorPosition, loopRange, isSimplifiedMode]);

    return (
        <ScoreContext.Provider value={context}>
            {children}
        </ScoreContext.Provider>);
}
export const useScoreContext = () => {
    const context = useContext(ScoreContext);
    if (isEmpty(context)) {
        throw new Error('useScoreContext must be used within a ScoreContextProvider')
    }

    return context;
};
