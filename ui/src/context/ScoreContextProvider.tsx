import React, {RefObject, useEffect, useMemo, useState} from 'react';
import {Note, NoteType} from "../models/Note";
import {Score} from "../models/Score";
import {
    createNote,
    durationToScalar,
    EmptyScore,
    excludeNotePositionRange,
    getDurationOffset,
    getNextPitch, getPositionRange,
    getPositions,
    getPreviousPitch,
    includeNotePositionRange, sort,
    wouldProduceOverlap,
} from "../utils/helpers.tsx";
import {Voice} from "../models/Voice";
import {ScoreContext} from './ScoreContext';
import {useAudioContext} from "./AudioContext";
import {DefaultVoices} from "../utils/dictionaries";
import {DividerType} from "../models/Divider.ts";
import {StaveDimensions} from "../models/Dimensions.ts";
import useCursorCoords from "../hooks/useCursorCoords.tsx";
import {calculateStaveDimensions} from "../utils/calculation.helpers.tsx";
import {Layout, Playback} from "../utils/constants.ts";
import {HalfPosition} from "../models/HalfPosition.ts";
import {useHistoryContext} from "./HistoryContext.tsx";

interface Properties {
    children: React.ReactNode;
}

const ScoreContextProvider: React.FC<Properties> = ({children}) => {

    const audioContext = useAudioContext();
    const historyContext = useHistoryContext();

    const [score, setScore] = useState<Score>(structuredClone(EmptyScore));

    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [isExportMode, setIsExportMode] = useState<boolean>(false);
    const [isTypeMode, setIsTypeMode] = useState<boolean>(false);

    const [containerRef, setContainerRef] = useState<RefObject<HTMLElement> | undefined>();
    const [svgRef, setSvgRef] = useState<RefObject<SVGSVGElement> | undefined>();

    const [activePosition, setActivePosition] = useState<number>(-1);
    const [activeDuration, setActiveDuration] = useState<string>("8n");
    const [activeVoice, setActiveVoice] = useState<Voice>({...DefaultVoices[0]});

    const activate = (position: number) => {
        const notes = getNotes(position);
        if (notes.length) {
            audioContext.stopPlayback();
            audioContext.playNotes(notes);
            if (["2n", "4n", "8n"].includes(notes[0].duration as string)) {
                setActiveDuration(notes[0].duration)
            }
        }
        setActivePosition(position);
    }

    const next = () => {
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

    const getNote = (position: number, voice?: Voice): Note | undefined => {
        const notes = voice
            ? score.data.voices.find(v => v.name === voice.name)?.notes || []
            : score.data.voices.filter(v => !v.hidden).flatMap(v => v.notes) || [];
        return notes.find(n => n.position === position);
    }

    const updateActiveDuration = (duration: string) => {
        setActiveDuration(duration);
        changeNoteDuration(duration);
    }

    const insertOrUpdateNote = (pitch: string, pos?: number, dur?: string) => {
        takeSnapshot();

        const position = Math.max(pos !== undefined ? pos : activePosition, 0);
        const duration = dur || activeDuration;

        const note = getNote(position, activeVoice);
        if (note) {
            changePitch(note, pitch);
            return;
        }
        insertNote(pitch, position, duration);
    }

    const insertNote = (pitch: string, position: number, duration: string) => {
        const note: Note = createNote(pitch, position, duration);
        if (wouldProduceOverlap(activeVoice, note)) {
            note.duration = "8n";
        }

        const voice = score.data.voices.find(v => v.name === activeVoice.name);
        if (voice) {
            activeVoice.occupiedPositions = includeNotePositionRange(activeVoice, note);

            voice.notes.push(note);
            voice.notes.sort((a, b) => (a.position || 0) - (b.position || 0));

            activate(position);
            refresh();
        }
    }

    const removeNote = (position: number, moveToPrevious?: boolean) => {
        const note = getNote(position, activeVoice);
        if (note && activeVoice) {
            const voice = score.data.voices.find(v => v.name === activeVoice.name);
            if (voice) {
                voice.notes = voice.notes.filter(n => n.position !== note.position);

                activeVoice.occupiedPositions = excludeNotePositionRange(activeVoice, note);
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
            audioContext.playNotes([note]);
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
        score.data.voices
            .find(v => v.name === activeVoice.name)?.notes
            .filter(n => n.position > position)
            .forEach(n => {
                n.position += offset;
            });
        activeVoice.occupiedPositions = activeVoice.occupiedPositions?.map(n => n > position ? (n + offset) : n);
    }

    const shiftLeft = () => {
        if (activePosition <= 0 || !!getNote(activePosition - 1, activeVoice)) return;

        const newPosition = activePosition - 1;
        if (!activeVoice.occupiedPositions?.includes(newPosition)) {
            shiftNotes(newPosition, -1);
            activate(newPosition);
            refresh();
        }
    }

    const shiftRight = () => {
        if (activePosition < 0) return;
        shiftNotes(activePosition - 1, 1);
        setActivePosition(activePosition + 1);
        refresh();
    }

    const insertLyric = (text: string) => {
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
        if (!note) {
            return;
        }
        note.type = type;
        refresh();
    }

    const toggleBreak = () => {
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
        setActiveVoice({...DefaultVoices[0]});
        setActivePosition(0);
    }

    const takeSnapshot = () => {
        historyContext.push(score, activeVoice, activePosition, activeDuration);
    }

    const activeNote = useMemo(() => {
        if (!activeVoice) {
            return undefined;
        }
        return getNote(activePosition, activeVoice);
    }, [activePosition, activeVoice]);

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
            .find(v => v.name === activeVoice.name)?.notes
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
                    const key = `${n.position}-${n.pitch}-${v.type}`;
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
        const voice = score.data.voices.find(v => v.name === activeVoice.name);
        if (voice) {
            let occupiedPositions: number[] = [];
            voice.notes.forEach(n => {
                occupiedPositions = occupiedPositions.concat(getPositionRange(n));
            });
            activeVoice.occupiedPositions = sort(Array.from(new Set(occupiedPositions)));
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
        activeDuration, setActiveDuration: updateActiveDuration,
        activePosition, setActivePosition,
        activeVoice, setActiveVoice,
        cursorPosition,

        getNote,
        getNotes,

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

        containerRef, setContainerRef,
        svgRef, setSvgRef,

    }), [containerRef, endPosition, isEditMode, isExportMode, isTypeMode, dimensions, score, score.data.lyrics,
        activeNote, activePosition, activeVoice, activeDuration, cursorPosition]);

    return (
        <ScoreContext.Provider value={context}>
            {children}
        </ScoreContext.Provider>);
}

export default ScoreContextProvider;