import React from 'react';
import {Note, NoteType} from "../model/Note.ts";

export interface NoteControlsContextProperties {
    insertNote: (note: Note, moveToNext?: boolean) => void;
    removeNote: (position: number, moveToPrevious?: boolean) => void;
    changeDuration: (duration: string, note?: Note, shift?: boolean) => void;
    changePitch: (note: Note, pitch: string) => void;
    changeType: (note: Note, type: NoteType) => void;
    increasePitch: (note: Note) => void;
    decreasePitch: (note: Note) => void;
}

export const NoteControlsContext = React.createContext<NoteControlsContextProperties>({} as NoteControlsContextProperties);
