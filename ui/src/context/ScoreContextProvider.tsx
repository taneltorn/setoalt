import React, {RefObject, useEffect, useMemo, useState} from 'react';
import {Note} from "../models/Note";
import {Score} from "../models/Score";
import {
    durationToScalar,
    EmptyScore,
    getDurationOffset,
    getNextPitch,
    getPositions,
    getPreviousPitch,
} from "../utils/helpers.tsx";
import {Voice} from "../models/Voice";
import {Filter, ScoreContext} from './ScoreContext';
import {useAudioContext} from "./AudioContext";
import {Voices} from "../utils/dictionaries";
import {DividerType} from "../models/Divider.ts";
import {StaveDimensions} from "../models/Dimensions.ts";
import useCursorCoords from "../hooks/useCursorCoords.tsx";
import {calculateStaveDimensions} from "../utils/calculation.helpers.tsx";

interface Properties {
    showEditor?: boolean;
    children: React.ReactNode;
}

const ScoreContextProvider: React.FC<Properties> = ({showEditor, children}) => {

    const [score, setScore] = useState<Score>(EmptyScore);

    const [filter, setFilter] = useState<Filter>({});


    const [containerRef, setContainerRef] = useState<RefObject<HTMLElement> | undefined>();

    const [isEditMode, setIsEditMode] = useState<boolean>(!!showEditor);
    const [isTyping, setIsTyping] = useState<boolean>(false);

    const [semitones, setSemitones] = useState<number>(0);
    const [currentPosition, setCurrentPosition] = useState<number>(!!showEditor ? 0 : -1);
    const [currentNote, setCurrentNote] = useState<Note | undefined>();
    const [currentDuration, setCurrentDuration] = useState<string>("8n");
    const [currentVoice, setCurrentVoice] = useState<Voice>({...Voices[0]});
    const [cursorPosition, setCursorPosition] = useState<number>(0);

    const audioContext = useAudioContext();

    const mousePosition = useCursorCoords(containerRef);

    useMemo(() => {
        let position = mousePosition.x + (score.data.breaks[mousePosition.y - 1] || 0);
        if (position > score.data.breaks[mousePosition.y]) {
            position = -1;
        }
        setCursorPosition(position);
    }, [mousePosition.x, mousePosition.y]);

    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
    }

    // const changeCurrentPosition = (position: number) => {
    //     setCurrentPosition(position);
    //     const note = score.data.voices
    //         .filter(v => currentVoice ? v.name === currentVoice.name : true)
    //         .flatMap(v => v.notes)
    //         .find(n => n.position < position);
    //     if (note) {
    //         setCurrentNote(note);
    //     }
    // }
    //

    const selectNote = (note: Note) => {
        setCurrentNote(note);
        setCurrentPosition(note.position);
        setCurrentDuration(note.duration);

        const line = score.data.stave.lines.find(l => l.pitch === note.pitch);
        audioContext.playNote(note, currentVoice.name, {
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
        audioContext.playNote(note, currentVoice.name, {
            detune: note.detune || line?.detune,
            transpose: semitones
        });
    }

    const getNote = (position: number, voice?: Voice): Note | undefined => {
        const notes = voice
            ? score.data.voices.find(v => v.name === voice.name)?.notes || []
            : score.data.voices.flatMap(v => v.notes) || [];

        return notes.find(n => n.position === position);
    }

    const getNotes = (position: number): Note[] => {
        const notes = score.data.voices.flatMap(v => v.notes) || [];
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

        const note = getNote(position, currentVoice);
        if (note) {
            playNote(note);
            setCurrentDuration(note.duration);
        }
        setCurrentNote(note);
        setCurrentPosition(position);
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

        const note = getNote(position, currentVoice);
        if (note) {
            playNote(note);
            setCurrentDuration(note.duration);
        }
        setCurrentNote(note);
        setCurrentPosition(position);
        return position;
    }

    const changeDuration = (duration: string) => {
        setCurrentDuration(duration);

        if (currentNote) {

            const offset = getDurationOffset(duration, currentNote.duration)
            shiftNotes(currentNote.position, offset);

            currentNote.duration = duration;
            playNote(currentNote);
        }
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
    }

    const shiftLeft = () => {
        // todo atm does not take into account prev note duration
        if (currentPosition <= 0 || !!getNote(currentPosition - 1, currentVoice)) return;

        shiftNotes(currentPosition - 1, -1);
        refresh();
        setCurrentPosition(currentPosition - 1);

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
    const insertOrUpdateNote = (pitch: string, position: number, moveToNext?: boolean) => {
        const note = getNote(position, currentVoice);
        if (note) {
            changePitch(note, pitch, moveToNext);
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

        if (!score.data.voices.find(v => v.name === currentVoice.name)) {
            score.data.voices.push({...currentVoice, notes: []});
        }

        const voice = score.data.voices.find(v => v.name === currentVoice.name);
        if (voice) {
            voice.notes.push(note);
            voice.notes.sort((a, b) => (a.position || 0) - (b.position || 0));

            if (moveToNext) {
                const newPosition = note.position + durationToScalar(note.duration);
                setCurrentPosition(newPosition);
            } else {
                setCurrentPosition(position);
                setCurrentNote(note);
            }

            playNote(note);
            refresh();
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

    const dimensions: StaveDimensions = useMemo<StaveDimensions>(() => calculateStaveDimensions(score),
        // todo, atm calc is trigged for each change, need to listen only for line and break changes, [score.data.stave.lines, score.data.dividers] does not work
        [score]);

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

    const context = useMemo(() => ({
        containerRef,
        setContainerRef,

        filter, setFilter,
        dimensions,
        score, setScore,
        isEditMode, setIsEditMode,
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