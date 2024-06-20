import React, {RefObject, useContext} from 'react';
import {Note, NoteType} from "../models/Note";
import {isEmpty} from "../utils/helpers.tsx";
import {Score} from "../models/Score";
import {Voice} from "../models/Voice";
import {StaveDimensions} from "../models/Dimensions.ts";

export interface ScoreContextProperties {

    score: Score;
    setScore: (score: Score) => void;

    isEditMode: boolean;
    setIsEditMode: (value: boolean) => void;
    isExportMode: boolean;
    setIsExportMode: (value: boolean) => void;
    isTypeMode: boolean;
    setIsTypeMode: (value: boolean) => void;

    transposition: number;
    setTransposition: (semitones: number) => void;

    activate: (position: number) => void;
    next: () => void;
    previous: () => void;

    activeNote: Note | undefined;
    activePosition: number;
    setActivePosition: (position: number) => void;
    activeDuration: string;
    activeVoice: Voice;
    setActiveVoice: (voice: Voice) => void;
    cursorPosition: number;

    getNote: (position: number, voice?: Voice) => Note | undefined;
    getNotes: (position: number) => Note[];

    insertOrUpdateNote: (pitch: string, position?: number, duration?: string) => void;
    removeNote: () => void;
    insertLyric: (text: string) => void;

    toggleBreak: () => void;
    removeBreak: (position: number) => void;
    toggleDivider: () => void;
    removeDivider: (position: number) => void;

    changeType: (note: Note | undefined, type: NoteType | undefined) => void;
    changeDuration: (duration: string) => void;
    increaseActiveNotePitch: () => void;
    decreaseActiveNotePitch: () => void;

    shiftLeft: () => void;
    shiftRight: () => void;

    refresh: () => void;
    clear: () => void;

    dimensions: StaveDimensions;
    endPosition: number;

    containerRef: RefObject<HTMLElement> | undefined;
    setContainerRef: (ref: RefObject<HTMLElement>) => void;
    svgRef: RefObject<SVGSVGElement> | undefined;
    setSvgRef: (ref: RefObject<SVGSVGElement>) => void;
}

export const ScoreContext = React.createContext<ScoreContextProperties>({} as ScoreContextProperties)
export const useScoreContext = () => {
    const context = useContext(ScoreContext);
    if (isEmpty(context)) {
        throw new Error('useScoreContext must be used within a ScoreContextProvider')
    }

    return context;
};
