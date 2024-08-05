import React, {useContext, useMemo} from 'react';
import {
    durationToScalar,
    excludeNotePositionRange,
    includeNotePositionRange,
    isEmpty,
    wouldProduceOverlap
} from "../utils/helpers.tsx";
import {Note, NoteType} from "../model/Note.ts";
import {useScoreContext} from "./useScoreContext.tsx";
import {useAudioContext} from "./useAudioContext.tsx";
import {useLayoutControls} from "./useLayoutControls.tsx";
import {useHistory} from "./useHistory.tsx";
import {NoteControlsContext} from '../context/NoteControlsContext.tsx';

interface Properties {
    children: React.ReactNode;
}

export const NoteControlsContextProvider: React.FC<Properties> = ({children}) => {

    const context = useScoreContext();
    const history = useHistory();
    const {shiftNotes} = useLayoutControls();
    const {playNotes} = useAudioContext();

    const insertNote = (note: Note, moveToNext?: boolean) => {
        history.snapshot(context)

        const voice = context.score.data.voices.find(v => v.name === context.activeVoice);
        if (voice) {
            if (wouldProduceOverlap(note, voice.occupiedPositions)) {
                note.duration = "8n";
            }
            voice.occupiedPositions = includeNotePositionRange(note, voice.occupiedPositions);

            voice.notes.push(note);
            voice.notes.sort((a, b) => (a.position || 0) - (b.position || 0));

            context.refresh();
            if (moveToNext) {
                context.activate(note.position + 1);
            }
        }
    }

    const removeNote = (position: number, moveToPrevious?: boolean) => {
        const note = context.getNote(position, context.activeVoice);
        if (note && context.activeVoice) {
            history.snapshot(context);

            const voice = context.score.data.voices.find(v => v.name === context.activeVoice);
            if (voice) {
                voice.notes = voice.notes.filter(n => n.position !== note.position);
                voice.occupiedPositions = excludeNotePositionRange(note, voice.occupiedPositions)
            }
            context.refresh();
        }
        if (moveToPrevious) {
            context.previous();
        }
    }

    const changeType = (note: Note, type: NoteType) => {
        history.snapshot(context);

        if (!note) {
            return;
        }
        note.type = type;
        context.refresh();
    }

    const changeDuration = (duration: string, note?: Note, shift?: boolean) => {
        context.setActiveDuration(duration);

        if (note) {
            if (shift) {
                const offset = durationToScalar(duration) - durationToScalar(note.duration);
                const voices = context.score.data.voices.filter(v => v.name === context.activeVoice) || [];
                shiftNotes(note.position, offset, voices);
            }

            note.duration = duration;
            playNotes([note], context.score.data.stave);
        }
    }

    const changePitch = (note: Note, pitch: string) => {
        note.pitch = pitch;

        playNotes([note], context.score.data.stave);
        context.refresh();
    }

    const increasePitch = (note: Note) => {
        if (note) {
            const pitches = context.score.data.stave.lines.map(l => l.pitch);
            const index = pitches.findIndex(p => p === note.pitch);

            const pitch = pitches[Math.max(index - 1, 0)];
            changePitch(note, pitch);
        }
    }

    const decreasePitch = (note: Note) => {
        if (note) {
            const pitches = context.score.data.stave.lines.map(l => l.pitch);
            const index = pitches.findIndex(p => p === note.pitch);

            const pitch = pitches[Math.min(index + 1, pitches.length - 1)];
            changePitch(note, pitch);
        }
    }

    const ctx = useMemo(() => ({
        insertNote,
        removeNote,
        changeDuration,
        changePitch,
        changeType,
        increasePitch,
        decreasePitch
    }), [context.score, context.endPosition]);

    return (
        <NoteControlsContext.Provider value={ctx}>
            {children}
        </NoteControlsContext.Provider>);
}

export const useNoteControls = () => {
    const context = useContext(NoteControlsContext);
    if (isEmpty(context)) {
        throw new Error('useNoteControls must be used within a NoteControlsContextProvider')
    }

    return context;
};
