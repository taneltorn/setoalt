import React, {RefObject, useEffect, useMemo, useState} from 'react';
import {Note, NoteType} from "../models/Note";
import {Score} from "../models/Score";
import {
    durationToScalar,
    EmptyScore,
    excludeNotePositionRange,
    getDurationOffset,
    getNextPitch,
    getPositions,
    getPreviousPitch,
    includeNotePositionRange,
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
import {Layout} from "../utils/constants.ts";

interface Properties {
    children: React.ReactNode;
}

const ScoreContextProvider: React.FC<Properties> = ({children}) => {

    const [score, setScore] = useState<Score>({...EmptyScore});

    const [containerRef, setContainerRef] = useState<RefObject<HTMLElement> | undefined>();

    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [isExportMode, setIsExportMode] = useState<boolean>(false);
    const [isTyping, setIsTyping] = useState<boolean>(false);

    const [semitones, setSemitones] = useState<number>(0);
    const [currentPosition, setCurrentPosition] = useState<number>(-1);
    const [currentNote, setCurrentNote] = useState<Note | undefined>();
    const [currentDuration, setCurrentDuration] = useState<string>("8n");
    const [currentVoice, setCurrentVoice] = useState<Voice>({...DefaultVoices[0]});
    const [cursorPosition, setCursorPosition] = useState<number>(0);

    const audioContext = useAudioContext();

    const cursorCoords = useCursorCoords(containerRef);

    useMemo(() => {
        let position = cursorCoords.x + (score.data.breaks[cursorCoords.y - 1] || 0);
        if (position > score.data.breaks[cursorCoords.y]) {
            position = -1;
        }
        setCursorPosition(position);
    }, [cursorCoords.x, cursorCoords.y]);

    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
    }

    const selectNote = (note: Note) => {
        audioContext.stopPlayback();

        setCurrentNote(note);
        setCurrentPosition(note.position);
        setCurrentDuration(note.duration);

        const line = score.data.stave.lines.find(l => l.pitch === note.pitch);
        audioContext.playNote(note, isEditMode ? currentVoice : undefined, {
            detune: note.detune || line?.detune,
            transpose: semitones
        });
    }

    const selectPosition = (position: number) => {
        const note = getNote(position, currentVoice);
        if (note) {
            selectNote(note);
            return;
        }
        setCurrentPosition(position);
        setCurrentNote(undefined);
    }

    const playNote = (note: Note) => {
        const line = score.data.stave.lines.find(l => l.pitch === note.pitch);
        audioContext.playNote(note, isEditMode ? currentVoice : undefined, {
            detune: note.detune || line?.detune,
            transpose: semitones
        });
    }

    const getNote = (position: number, voice?: Voice): Note | undefined => {
        const notes = voice
            ? score.data.voices.find(v => v.name === voice.name)?.notes || []
            : score.data.voices.filter(v => !v.hidden).flatMap(v => v.notes) || [];
        return notes.find(n => n.position === position);
    }

    const getNotes = (position: number): Note[] => {
        const notes = score.data.voices.filter(v => !v.hidden).flatMap(v => v.notes) || [];
        return notes.filter(n => n.position === position);
    }


    const next = (): number => {
        let position: number;
        if (isEditMode) {
            const currentNote = getNote(currentPosition, currentVoice);
            position = currentNote
                ? currentNote.position + durationToScalar(currentNote.duration)
                : currentPosition + 1;
        } else {
            const positions = getPositions(score.data.voices);
            const currentPositionIndex = positions.findIndex(p => p === currentPosition);

            position = positions[Math.min(currentPositionIndex + 1, positions.length - 1)];
        }


        const note = getNote(position, isEditMode ? currentVoice : undefined);
        if (note) {
            selectNote(note)
        } else {
            setCurrentNote(undefined);
            setCurrentPosition(position);
        }

        return position;
    }

    const previous = (): number => {
        let position: number;
        if (isEditMode) {
            const closestNote: Note | undefined = score.data.voices
                .filter(v => currentVoice ? v.name === currentVoice.name : true)
                .flatMap(v => v.notes)
                .filter(n => n.position < currentPosition)
                .slice(-1)?.[0];

            if (closestNote && (closestNote.position + durationToScalar(closestNote.duration)) > (currentPosition - 1)) {
                position = closestNote.position;
            } else {
                position = Math.max(currentPosition - 1, 0);
            }
        } else {
            const positions = getPositions(score.data.voices);
            const currentPositionIndex = positions.findIndex(p => p === currentPosition);
            position = positions[Math.max(currentPositionIndex - 1, 0)];
        }
        const note = getNote(position, isEditMode ? currentVoice : undefined);
        if (note) {
            selectNote(note);
        } else {
            setCurrentNote(undefined);
            setCurrentPosition(position);
        }
        return position;
    }


    const shiftNotes = (position: number, offset: number, resetCurrentNote?: boolean) => {
        if (resetCurrentNote) {
            setCurrentNote(undefined);
        }
        score.data.voices
            .find(v => v.name === currentVoice.name)?.notes
            .filter(n => n.position > position)
            .forEach(n => {
                n.position += offset;
                if (currentPosition === n.position) {
                    setCurrentNote(n);
                }
            });

        currentVoice.occupiedPositions = currentVoice.occupiedPositions?.map(n => n > position ? (n + offset) : n);

    }

    const shiftLeft = () => {
        if (currentPosition <= 0 || !!getNote(currentPosition - 1, currentVoice)) return;

        const newPosition = currentPosition - 1;
        if (!currentVoice.occupiedPositions?.includes(newPosition)) {
            shiftNotes(newPosition, -1);
            refresh();
            setCurrentPosition(newPosition);
            setCurrentNote(getNote(newPosition, currentVoice));
        }
    }

    const shiftRight = () => {
        if (currentPosition < 0) return;

        shiftNotes(currentPosition - 1, 1);
        refresh();
        setCurrentPosition(currentPosition + 1);
    }

    const addLyric = (text: string) => {
        const lyric = score.data.lyrics.find(l => l.position === currentPosition);
        if (lyric) {
            lyric.text = text;
            return;
        }
        score.data.lyrics.push({
            text: text,
            position: currentPosition
        });
    }

    const changeType = (note: Note | undefined, type: NoteType | undefined) => {
        if (!note) {
            return;
        }
        note.type = type;
        refresh();
    }

    const insertOrUpdateNote = (pitch: string, position: number, moveToNext?: boolean) => {
        const note = getNote(position, currentVoice);
        if (note) {
            changePitch(note, pitch);
            return;
        }
        insertNote(pitch, position, moveToNext);
    }

    const insertNote = (pitch: string, position: number, moveToNext?: boolean) => {
        const p = position;
        const note: Note = {
            pitch: pitch,
            position: p > 0 ? p : 0,
            duration: currentDuration,
        }
        if (wouldProduceOverlap(currentVoice, note)) {
            note.duration = "8n";
            setCurrentDuration("8n");
        }

        if (!score.data.voices.find(v => v.name === currentVoice.name)) {
            score.data.voices.push({...currentVoice, notes: []});
        }

        const voice = score.data.voices.find(v => v.name === currentVoice.name);
        if (voice) {
            currentVoice.occupiedPositions = includeNotePositionRange(currentVoice, note);

            voice.notes.push(note);
            voice.notes.sort((a, b) => (a.position || 0) - (b.position || 0));

            if (moveToNext) {
                const newPosition = note.position + durationToScalar(note.duration);
                setCurrentPosition(newPosition);
                setCurrentNote(getNote(newPosition, currentVoice));
            } else {
                setCurrentPosition(position);
                setCurrentNote(note);
            }

            playNote(note);
            refresh();
        }
    }

    const changeDuration = (duration: string) => {
        setCurrentDuration(duration);

        if (currentNote) {
            currentVoice.occupiedPositions = excludeNotePositionRange(currentVoice, currentNote);

            const offset = getDurationOffset(duration, currentNote.duration)
            shiftNotes(currentNote.position, offset);

            currentNote.duration = duration;
            currentVoice.occupiedPositions = includeNotePositionRange(currentVoice, currentNote);

            playNote(currentNote);
        }
    }

    const changePitch = (note: Note, pitch: string, moveToNext?: boolean) => {
        if (!note) {
            return;
        }
        note.pitch = pitch;
        selectNote(note);
        refresh();
        if (moveToNext) {
            next();
        }
    }

    const removeNote = () => {
        if (currentNote && currentVoice) {
            const voice = score.data.voices.find(v => v.name === currentVoice.name);
            if (voice) {
                voice.notes = voice.notes.filter(n => n.position !== currentNote.position);

                currentVoice.occupiedPositions = excludeNotePositionRange(currentVoice, currentNote);
                setCurrentNote(undefined);
            }
            refresh();
        }
        previous();
    }


    const increasePitch = () => {
        if (currentNote) {
            const pitch = getNextPitch(score.data.stave.lines.map(l => l.pitch), currentNote.pitch);
            changePitch(currentNote, pitch);
        }
    }

    const decreasePitch = () => {
        if (currentNote) {
            const pitch = getPreviousPitch(score.data.stave.lines.map(l => l.pitch), currentNote.pitch);
            changePitch(currentNote, pitch);
        }
    }

    const toggleBreak = (position: number) => {
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

    const toggleInlineDivider = () => {
        const position = currentPosition;

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

    const clear = () => {
        score.data.breaks = [];
        score.data.dividers = [];
        score.data.lyrics = [];
        score.data.voices = [];
        setCurrentPosition(0);
        setCurrentNote(undefined);
        refresh();
    }

    const dimensions: StaveDimensions = useMemo<StaveDimensions>(() => calculateStaveDimensions(score), [score, score.data.breaks, score.data.voices]);

    const endPosition: number = useMemo<number>(() => {
        const notes = score.data.voices.flatMap(v => v.notes).sort((a, b) => a.position - b.position);
        const lyrics = score.data.lyrics.sort((a, b) => a.position - b.position);
        const lastNote = notes.slice(-1).pop();
        const lastLyric = lyrics.slice(-1).pop();


        return Math.max(lastLyric?.position || 0, ((lastNote?.position || 0) + (lastNote?.duration ? durationToScalar(lastNote.duration) : 0)));
    }, [score]);

    useEffect(() => {
        audioContext.setTempo(score.defaultTempo || 80);
    }, [score.defaultTempo]);

    useEffect(() => {
        // todo optimize
        const x = currentPosition * Layout.stave.note.SPACING + Layout.stave.container.PADDING_X_START;
        if (containerRef?.current) {
            if (x > (Layout.stave.container.MAX_WIDTH + containerRef.current.scrollLeft - Layout.stave.container.PADDING_X_END)
                || x <= containerRef.current.scrollLeft) {
                containerRef?.current.scrollTo(x - Layout.stave.container.PADDING_X_START, 0)
            }
        }

        let position = cursorCoords.x + (score.data.breaks[cursorCoords.y - 1] || 0);
        if (position > score.data.breaks[cursorCoords.y]) {
            position = -1;
        }
        setCursorPosition(position);
    }, [currentPosition]);


    const context = useMemo(() => ({
        containerRef,
        setContainerRef,

        dimensions,
        score, setScore,
        isEditMode, setIsEditMode,
        isExportMode, setIsExportMode,
        toggleEditMode,
        isTyping, setIsTyping,
        endPosition,
        currentPosition, setCurrentPosition,
        currentNote, setCurrentNote,
        currentVoice, setCurrentVoice,
        currentDuration, setCurrentDuration,
        cursorPosition, setCursorPosition,

        selectNote,
        selectPosition,

        next,
        previous,
        getNote,
        getNotes,
        refresh,
        shiftNotes,
        shiftLeft,
        shiftRight,
        toggleBreak,
        insertBreak,
        removeBreak,
        toggleInlineDivider,
        insertDivider,
        removeDivider,
        semitones,
        setSemitones,

        addLyric,
        insertOrUpdateNote,
        insertNote,
        removeNote,

        changeType,
        changeDuration,
        changePitch,
        increasePitch,
        decreasePitch,
        clear
    }), [containerRef, endPosition, isEditMode, isTyping, dimensions, semitones, score, score.data.voices, currentNote, currentPosition, currentVoice, currentDuration, cursorPosition]);

    return (
        <ScoreContext.Provider value={context}>
            {children}
        </ScoreContext.Provider>);
}

export default ScoreContextProvider;