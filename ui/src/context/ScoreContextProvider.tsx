import React, {MutableRefObject, useEffect, useMemo, useState} from 'react';
import {Note} from "../models/Note";
import {Score} from "../models/Score";
import {
    calculateDimensions,
    durationToScalar,
    EmptyScore,
    getDurationOffset,
    getNextPitch,
    getNextPosition,
    getPreviousPitch,
    getPreviousPosition,
    sort
} from "../utils/helpers.tsx";
import {Voice} from "../models/Voice";
import {ScoreContext} from './ScoreContext';
import {useAudioContext} from "./AudioContext";
import {Voices} from "../utils/dictionaries";
import {Coordinates} from "../models/Coordinates";

interface Properties {
    showEditor?: boolean;
    children: React.ReactNode;
}

const ScoreContextProvider: React.FC<Properties> = ({showEditor, children}) => {

    const [score, setScore] = useState<Score>(EmptyScore);
    const [containerRef, setContainerRef] = useState<MutableRefObject<any> | undefined>();

    const [isEditMode, setIsEditMode] = useState<boolean>(!!showEditor);
    const [isTyping, setIsTyping] = useState<boolean>(false);

    const [semitones, setSemitones] = useState<number>(0);
    const [currentPosition, setCurrentPosition] = useState<number>(-1);
    const [currentNote, setCurrentNote] = useState<Note | undefined>();
    const [currentDuration, setCurrentDuration] = useState<string>("8n");
    const [currentVoice, setCurrentVoice] = useState<Voice>({...Voices[0]});

    const audioContext = useAudioContext();

    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
    }

    const getNote = (position: number, voice?: Voice): Note | undefined => {
        const notes = voice
            ? score.data.voices.find(v => v.name === voice.name)?.notes || []
            : score.data.voices.flatMap(v => v.notes) || [];

        return notes.find(n => n.position === position);
    }

    const getNotes = (position?: number): Note[] => {
        const notes = score.data.voices.flatMap(v => v.notes) || [];
        if (position !== undefined) {
            return notes.filter(n => n.position === position);
        }
        return notes;
    }

    const next = (): number => {
        const position = getNextPosition(currentPosition, score.data.voices, currentNote, isEditMode);
        setCurrentPosition(position);

        const note = getNote(position, currentVoice);
        setCurrentNote(note);
        if (note?.duration) {
            setCurrentDuration(note?.duration);
        }

        return position;
    }

    const previous = (): number => {
        const position = getPreviousPosition(currentPosition, score.data.voices, currentVoice, isEditMode);
        setCurrentPosition(position);

        const note = getNote(position, currentVoice);
        setCurrentNote(note);
        if (note?.duration) {
            setCurrentDuration(note?.duration);
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
    }

    const shiftLeft = () => {
        if (currentNote || currentPosition < 0) return;

        shiftNotes(currentPosition, -1, true);
        refresh();
    }

    const shiftRight = () => {
        if (currentPosition < 0) return;

        shiftNotes(currentPosition - 1, 1, true);
        refresh();
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

    const addNote = (pitch: string) => {
        const note: Note = {
            pitch: pitch,
            position: currentPosition > 0 ? currentPosition : 0,
            duration: currentDuration,
        }

        if (!score.data.voices.find(v => v.name === currentVoice.name)) {
            score.data.voices.push({...currentVoice, notes: []});
        }

        const voice = score.data.voices.find(v => v.name === currentVoice.name);
        if (voice) {
            voice.notes.push(note);

            const newPosition = note.position + durationToScalar(note.duration);
            setCurrentPosition(newPosition);

            const line = score.data.stave.lines.find(l => l.pitch === pitch);
            audioContext.playNote(note, voice, note.detune || line?.detune, semitones);

            const newPositionNote = getNote(newPosition, currentVoice);
            if (newPositionNote) {
                setCurrentNote(newPositionNote);
            }
        }
        refresh();
    }

    const removeNote = () => {
        if (!currentNote || !currentVoice) return;

        const voice = score.data.voices.find(v => v.name === currentVoice.name);
        if (voice) {
            voice.notes = voice.notes.filter(n => n.position !== currentNote.position);
            setCurrentNote(undefined);
        }

        refresh();
    }

    const changeDuration = (duration: string) => {
        setCurrentDuration(duration);

        if (currentNote) {
            const offset = getDurationOffset(duration, currentNote.duration)
            shiftNotes(currentNote.position, offset);

            currentNote.duration = duration;
            const line = score.data.stave.lines.find(l => l.pitch === currentNote.pitch);
            audioContext.playNote(currentNote, currentVoice, currentNote.detune || line?.detune, semitones);

            refresh();
        }
    }

    const changePitch = (pitch: string) => {
        if (currentNote) {
            currentNote.pitch = pitch;
            const line = score.data.stave.lines.find(l => l.pitch === pitch);
            audioContext.playNote(currentNote, currentVoice, currentNote.detune || line?.detune, semitones);

            refresh();
        }
    }

    const increasePitch = () => {
        if (currentNote) {
            const pitch = getNextPitch(score.data.stave.lines.map(l => l.pitch), currentNote.pitch);
            changePitch(pitch);
        }
    }

    const decreasePitch = () => {
        if (currentNote) {
            const pitch = getPreviousPitch(score.data.stave.lines.map(l => l.pitch), currentNote.pitch);
            changePitch(pitch);
        }
    }

    const toggleBreak = () => {
        if (context.score.data.breaks.findIndex(d => d === context.currentPosition) >= 0) {
            removeBreak(currentPosition);
            return;
        }
        context.insertBreak(currentPosition);
    }

    const insertBreak = (position: number) => {
        score.data.breaks.push(position);
        sort(score.data.breaks);
        refresh();
    }

    const removeBreak = (position: number) => {
        score.data.breaks = score.data.breaks.filter(n => n !== position);
        refresh();
    }

    const toggleDivider = () => {
        if (context.score.data.dividers.findIndex(d => d === context.currentPosition) >= 0) {
            removeDivider(currentPosition)
            return;
        }
        context.insertDivider(currentPosition);
    }

    const insertDivider = (position: number) => {
        score.data.dividers.push(position);
        sort(score.data.dividers);
        refresh();
    }

    const removeDivider = (position: number) => {
        score.data.dividers = score.data.dividers.filter(n => n !== position);
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

    const dimensions: { x: number, y: number } = useMemo<Coordinates>(() => calculateDimensions(score), [score]);

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
        toggleDivider,
        insertDivider,
        removeDivider,
        semitones,
        setSemitones,

        addLyric,
        addNote,
        removeNote,

        changeDuration,
        changePitch,
        increasePitch,
        decreasePitch,
        clear
    }), [containerRef, endPosition, isEditMode, isTyping, dimensions, semitones, score, score.data.voices, currentNote, currentPosition, currentVoice, currentDuration]);

    return (
        <ScoreContext.Provider value={context}>
            {children}
        </ScoreContext.Provider>);
}

export default ScoreContextProvider;