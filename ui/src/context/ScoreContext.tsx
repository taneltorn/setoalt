import React, {RefObject} from 'react';
import {Note} from "../model/Note";
import {Score} from "../model/Score";
import {StaveDimensions} from "../model/Dimensions.ts";
import {HalfPosition} from "../model/HalfPosition.ts";
import {Range} from "../model/Range.ts";

export interface ScoreContextProperties {

    score: Score;
    setScore: (score: Score) => void;

    isEditMode: boolean;
    setIsEditMode: (value: boolean) => void;

    isSimplifiedMode: boolean;
    setIsSimplifiedMode: (value: boolean) => void;
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

    refresh: () => void;

    duplicateNoteKeys: string[];

    halfPositions: HalfPosition[];
    dimensions: StaveDimensions;
    endPosition: number;

    containerRef: RefObject<HTMLElement> | undefined;
    setContainerRef: (ref: RefObject<HTMLElement>) => void;
    svgRef: RefObject<SVGSVGElement> | undefined;
    setSvgRef: (ref: RefObject<SVGSVGElement>) => void;
}

export const ScoreContext = React.createContext<ScoreContextProperties>({} as ScoreContextProperties)
