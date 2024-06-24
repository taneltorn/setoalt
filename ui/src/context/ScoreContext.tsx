import React, {RefObject, useContext} from 'react';
import {Note, NoteType} from "../model/Note";
import {isEmpty} from "../utils/helpers.tsx";
import {Score} from "../model/Score";
import {StaveDimensions} from "../model/Dimensions.ts";
import {HalfPosition} from "../model/HalfPosition.ts";
import {Range} from "../model/Range.ts";

export interface ScoreContextProperties {

    score: Score;
    setScore: (score: Score) => void;

    isEditMode: boolean;
    setIsEditMode: (value: boolean) => void;
    isExportMode: boolean;
    setIsExportMode: (value: boolean) => void;
    isTypeMode: boolean;
    setIsTypeMode: (value: boolean) => void;

    loopRange: Range | undefined;
    setLoopRange: (range: Range | undefined) => void;
    updateLoopRange: (start: number, end: number) => void;

    activate: (position: number) => void;
    next: () => void;
    previous: () => void;

    activeNote: Note | undefined;
    activePosition: number;
    setActivePosition: (position: number) => void;
    activeDuration: string;
    setActiveDuration: (duration: string) => void;

    activeVoice: string;
    setActiveVoice: (name: string) => void;
    cursorPosition: number;

    getNote: (position: number, voiceName?: string) => Note | undefined;
    getNotes: (position: number) => Note[];
    scrollToPosition: (position: number) => void;

    insertOrUpdateNote: (pitch: string, position?: number, duration?: string, moveToNext?: boolean) => void;
    removeNote: (position: number, moveToPrevious?: boolean) => void;
    insertLyric: (text: string) => void;

    toggleBreak: () => void;
    removeBreak: (position: number) => void;
    toggleDivider: () => void;
    removeDivider: (position: number) => void;

    changeType: (note: Note | undefined, type: NoteType | undefined) => void;
    changeNoteDuration: (duration: string, position?: number, skipShifting?: boolean) => void;
    increaseNotePitch: (position?: number) => void;
    decreaseNotePitch: (position?: number) => void;

    shiftLeft: () => void;
    shiftRight: () => void;

    refresh: () => void;
    reset: () => void;

    duplicateNoteKeys: string[];

    halfPositions: HalfPosition[];
    dimensions: StaveDimensions;
    endPosition: number;
    takeSnapshot: () => void;

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
