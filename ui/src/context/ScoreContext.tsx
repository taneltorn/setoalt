import React, {MutableRefObject, useContext} from 'react';
import {Note} from "../models/Note";
import {isEmpty} from "../utils/helpers.tsx";
import {Score} from "../models/Score";
import {Voice} from "../models/Voice";

export interface ScoreContextProperties {

    containerRef: MutableRefObject<any> | undefined;
    setContainerRef: (ref: MutableRefObject<any> | undefined) => void;

    dimensions: { x: number, y: number };

    score: Score;
    setScore: (score: Score) => void;

    isEditMode: boolean;
    setIsEditMode: (value: boolean) => void;
    toggleEditMode: () => void;
    isTyping: boolean;
    setIsTyping: (value: boolean) => void;

    semitones: number;
    setSemitones: (semitones: number) => void;
    endPosition: number;
    currentPosition: number;
    setCurrentPosition: (index: number) => void;
    currentNote: Note | undefined;
    setCurrentNote: (note: Note | undefined) => void;
    currentDuration: string;
    setCurrentDuration: (duration: string) => void;
    currentVoice: Voice;
    setCurrentVoice: (voice: Voice) => void;

    next: () => number;
    previous: () => number;

    getNote: (position: number, voice?: Voice) => Note | undefined;
    getNotes: (position?: number) => Note[];

    toggleBreak: () => void;
    insertBreak: (position: number) => void;
    removeBreak: (position: number) => void;

    toggleDivider: () => void;
    insertDivider: (position: number) => void;
    removeDivider: (position: number) => void;

    addLyric: (text: string) => void;
    addNote: (pitch: string) => void;
    removeNote: () => void;

    changeDuration: (duration: string) => void;
    changePitch: (pitch: string) => void;
    increasePitch: () => void;
    decreasePitch: () => void;

    shiftLeft: () => void;
    shiftRight: () => void;
    shiftNotes: (position: number, offset: number) => void;

    refresh: () => void;
    clear: () => void;
}

export const ScoreContext = React.createContext<ScoreContextProperties>({} as ScoreContextProperties)
export const useScoreContext = () => {
    const context = useContext(ScoreContext);
    if (isEmpty(context)) {
        throw new Error('useScoreContext must be used within a ScoreContextProvider')
    }

    return context;
};
