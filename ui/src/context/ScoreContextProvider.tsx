import React, {RefObject, useEffect, useMemo, useState} from 'react';
import {Note, NoteType} from "../model/Note";
import {Score} from "../model/Score";
import {
    createNote,
    durationToScalar,
    EmptyScore,
    excludeNotePositionRange,
    getDurationOffset,
    getNextPitch,
    getPositionRange,
    getPositions,
    getPreviousPitch,
    includeNotePositionRange,
    sort,
    wouldProduceOverlap,
} from "../utils/helpers.tsx";
import {Voice, VoiceType} from "../model/Voice";
import {ScoreContext} from './ScoreContext';
import {useAudioContext} from "./AudioContext";
import {DefaultVoices} from "../utils/dictionaries.ts";
import {DividerType} from "../model/Divider.ts";
import {StaveDimensions} from "../model/Dimensions.ts";
import useCursorCoords from "../hooks/useCursorCoords.tsx";
import {calculateStaveDimensions, getOffset, isInsideLoop} from "../utils/calculation.helpers.tsx";
import {Layout, Playback} from "../utils/constants.ts";
import {HalfPosition} from "../model/HalfPosition.ts";
import {useHistory} from "./HistoryContext.tsx";
import {Range} from "../model/Range.ts";

interface Properties {
    children: React.ReactNode;
}

// todo: could refactor a lot here

const ScoreContextProvider: React.FC<Properties> = ({children}) => {

    const audioContext = useAudioContext();
    const history = useHistory();

    const [score, setScore] = useState<Score>(structuredClone(EmptyScore));

    const [isEditMode, setIsEditMode] = useState<boolean>(false);
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
            setLoopRange(undefined);
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
        // todo take half positions into account (currently they are skipped)
        let position: number;
        if (isEditMode) {
            const note = getNote(activePosition, activeVoice);
            position = note
                ? note.position + durationToScalar(note.duration)
                : activePosition + 1;
        } else {
            const positions = getPositions(score.data.voices.filter(v => !v.hidden));
            const currentPositionIndex = positions.findIndex(p => p === activePosition);
            position = positions[Math.min(currentPositionIndex + 1, positions.length - 1)];
        }
        activate(position);
    }

    const previous = () => {
        let position: number;
        if (isEditMode) {
            const closestNote: Note | undefined = score.data.voices
                .filter(v => !v.hidden)
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
            .filter(v => !v.hidden && (!voice || v.name === voice.name))
            .flatMap(v => v.notes) || [];
        return notes.filter(n => n.position === position);
    }

    const getNote = (position: number, voiceName?: string): Note | undefined => {
        const notes = voiceName
            ? score.data.voices.find(v => v.name === voiceName)?.notes || []
            : score.data.voices.filter(v => !v.hidden).flatMap(v => v.notes) || [];
        return notes.find(n => n.position === position);
    }

    const updateActiveDuration = (duration: string) => {
        setActiveDuration(duration);
        changeNoteDuration(duration);
    }

    const insertOrUpdateNote = (pitch: string, pos?: number, dur?: string, moveToNext?: boolean) => {
        takeSnapshot();

        const position = Math.max(pos !== undefined ? pos : activePosition, 0);
        const duration = dur || activeDuration;

        const note = getNote(position, activeVoice);
        if (note) {
            changePitch(note, pitch);
            return;
        }
        insertNote(pitch, position, duration, moveToNext);
    }

    const insertNote = (pitch: string, position: number, duration: string, moveToNext?: boolean) => {
        const note: Note = createNote(pitch, position, duration);
        const voice = score.data.voices.find(v => v.name === activeVoice);

        if (voice) {
            if (wouldProduceOverlap(note, voice.occupiedPositions)) {
                note.duration = "8n";
            }
            voice.occupiedPositions = includeNotePositionRange(note, voice.occupiedPositions);

            voice.notes.push(note);
            voice.notes.sort((a, b) => (a.position || 0) - (b.position || 0));

            activate(position);
            refresh();

            if (moveToNext) {
                next();
            }
        }
    }

    const removeNote = (position: number, moveToPrevious?: boolean) => {
        const note = getNote(position, activeVoice);
        if (note && activeVoice) {
            takeSnapshot();

            const voice = score.data.voices.find(v => v.name === activeVoice);
            if (voice) {
                voice.notes = voice.notes.filter(n => n.position !== note.position);
                voice.occupiedPositions = excludeNotePositionRange(note, voice.occupiedPositions)
            }
            refresh();
        }
        if (moveToPrevious) {
            previous();
        }
    }

    const changeNoteDuration = (duration: string, position?: number, skipShifting?: boolean) => {
        const note = position ? getNote(position, activeVoice) : activeNote;
        if (note) {
            if (!skipShifting) {
                const offset = getDurationOffset(duration, note.duration)
                shiftNotes(note.position, offset);
            }
            note.duration = duration;
            audioContext.playNotes([note], score.data.stave);
        }
    }

    const increaseNotePitch = (position?: number) => {
        const note = position ? getNote(position, activeVoice) : activeNote;
        if (note) {
            const pitch = getNextPitch(score.data.stave.lines.map(l => l.pitch), note.pitch);
            changePitch(note, pitch);
        }
    }

    const decreaseNotePitch = (position?: number) => {
        const note = position ? getNote(position, activeVoice) : activeNote;
        if (note) {
            const pitch = getPreviousPitch(score.data.stave.lines.map(l => l.pitch), note.pitch);
            changePitch(note, pitch);
        }
    }

    const changePitch = (note: Note, pitch: string) => {
        note.pitch = pitch;
        activate(note.position);
        refresh();
    }

    const shiftNotes = (position: number, offset: number) => {
        const voice = score.data.voices.find(v => v.name === activeVoice);
        if (voice) {
            voice.notes
                .filter(n => n.position > position)
                .forEach(n => {
                    n.position += offset;
                });
            voice.occupiedPositions = voice.occupiedPositions?.map(n => n > position ? (n + offset) : n);
        }
    }

    const shiftLeft = () => {
        takeSnapshot();

        if (activePosition <= 0 || !!getNote(activePosition - 1, activeVoice)) {
            return;
        }
        const voice = score.data.voices.find(v => v.name === activeVoice);
        if (voice) {
            const newPosition = activePosition - 1;
            if (!voice.occupiedPositions?.includes(newPosition)) {
                shiftNotes(newPosition, -1);
                activate(newPosition);
                refresh();
            }
        }
    }

    const shiftRight = () => {
        takeSnapshot();

        if (activePosition < 0) return;
        shiftNotes(activePosition - 0.5, 1);
        setActivePosition(activePosition + 1);
        refresh();
    }

    const insertLyric = (text: string) => {
        takeSnapshot();

        const lyric = score.data.lyrics.find(l => l.position === activePosition);
        if (lyric) {
            lyric.text = text;
            return;
        }
        score.data.lyrics.push({
            text: text,
            position: activePosition
        });
    }

    const changeType = (note: Note | undefined, type: NoteType | undefined) => {
        takeSnapshot();

        if (!note) {
            return;
        }
        note.type = type;
        refresh();
    }

    const toggleBreak = () => {
        takeSnapshot();

        const position = activeNote ? (activeNote.position + durationToScalar(activeNote.duration)) : (activePosition + 1);
        const breakpoint = context.score.data.breaks.find(b => b === position);

        if (breakpoint) {
            removeBreak(position);
            return;
        }
        insertBreak(position);
    }

    const insertBreak = (position: number) => {
        score.data.breaks.push(position);
        score.data.breaks.sort((a, b) => a - b);
        refresh();
    }

    const removeBreak = (position: number) => {
        score.data.breaks = score.data.breaks.filter(b => b !== position);
        refresh();
    }

    const toggleDivider = () => {
        takeSnapshot();

        const position = activeNote ? (activeNote.position + durationToScalar(activeNote.duration)) : (activePosition + 1);
        const divider = context.score.data.dividers.find(it => it.position === position);
        if (divider) {
            if (divider.type === DividerType.BAR) {
                divider.type = DividerType.SEPARATOR;
            } else if (divider.type === DividerType.SEPARATOR) {
                removeDivider(position);
            }
            refresh();
            return;
        }
        context.insertDivider(position, DividerType.BAR);
    }

    const insertDivider = (position: number, type: DividerType) => {
        score.data.dividers.push({
            position: position,
            type: type
        });
        score.data.dividers.sort((a, b) => (a.position || 0) - (b.position || 0));
        refresh();
    }

    const removeDivider = (position: number) => {
        score.data.dividers = score.data.dividers.filter(d => d.position !== position);
        refresh();
    }

    const refresh = () => {
        setScore({...score});
    }

    const reset = () => {
        setScore(structuredClone(EmptyScore));
        setActiveVoice(DefaultVoices[0].name);
        setActivePosition(0);
        setLoopRange(undefined);
        history.setUndoStates([]);
        history.setRedoStates([]);
        history.setRecoverStates([]);
    }

    const takeSnapshot = () => {
        history.push(score, activePosition, activeDuration, activeVoice);
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
            .filter(v => isEditMode || !v.hidden)
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
        refresh()
    }, [score.data.voices, activeVoice, activeDuration]);


    const context = useMemo(() => ({
        score, setScore,

        isEditMode, setIsEditMode,
        isExportMode, setIsExportMode,
        isTypeMode, setIsTypeMode,

        activate,
        next,
        previous,

        activeNote,
        loopRange, setLoopRange, updateLoopRange,
        activeDuration, setActiveDuration: updateActiveDuration,
        activePosition, setActivePosition,
        activeVoice, setActiveVoice,
        cursorPosition,

        getNote,
        getNotes,
        scrollToPosition,

        shiftLeft,
        shiftRight,

        toggleBreak,
        insertBreak,
        removeBreak,
        toggleDivider,
        insertDivider,
        removeDivider,

        insertLyric,
        insertOrUpdateNote,
        insertNote,
        removeNote,

        changeType,
        changeNoteDuration,
        increaseNotePitch,
        decreaseNotePitch,

        refresh,
        reset,

        duplicateNoteKeys,
        halfPositions,
        dimensions,
        endPosition,
        takeSnapshot,

        containerRef, setContainerRef,
        svgRef, setSvgRef,

    }), [containerRef, endPosition, isEditMode, isExportMode, isTypeMode, dimensions, score, score.data.lyrics,
        activeNote, activePosition, activeVoice, activeDuration, cursorPosition, loopRange]);

    return (
        <ScoreContext.Provider value={context}>
            {children}
        </ScoreContext.Provider>);
}

export default ScoreContextProvider;