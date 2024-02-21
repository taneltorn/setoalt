import React, {RefObject, useContext} from 'react';
import {Note, NoteType} from "../models/Note";
import {isEmpty} from "../utils/helpers.tsx";
import {Score} from "../models/Score";
import {Voice} from "../models/Voice";
import {DividerType} from "../models/Divider.ts";
import {StaveDimensions} from "../models/Dimensions.ts";

export interface ScoreContextProperties {

    containerRef: RefObject<HTMLElement> | undefined;
    setContainerRef: (ref: RefObject<HTMLElement>) => void;

    dimensions: StaveDimensions;

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


    selectNote: (note: Note) => void;
    selectPosition: (position: number) => void;

    currentPosition: number;
    setCurrentPosition: (index: number) => void;
    cursorPosition: number;
    setCursorPosition: (index: number) => void;
    currentNote: Note | undefined;
    setCurrentNote: (note: Note | undefined) => void;
    currentDuration: string;
    setCurrentDuration: (duration: string) => void;
    currentVoice: Voice;
    setCurrentVoice: (voice: Voice) => void;

    next: () => number;
    previous: () => number;

    getNote: (position: number, voice?: Voice) => Note | undefined;
    getNotes: (position: number) => Note[];

    toggleBreak: (position: number) => void;
    insertBreak: (position: number) => void;
    removeBreak: (position: number) => void;

    toggleInlineDivider: () => void;
    insertDivider: (position: number, type: DividerType) => void;
    removeDivider: (position: number) => void;

    addLyric: (text: string) => void;
    insertOrUpdateNote: (pitch: string, position: number, moveToNext?: boolean) => void;
    insertNote: (pitch: string, position: number, moveToNext?: boolean) => void;
    removeNote: () => void;

    changeType: (note: Note | undefined, type: NoteType | undefined) => void;
    changeDuration: (duration: string) => void;
    changePitch: (note: Note, pitch: string, moveToNext?: boolean) => void;
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
