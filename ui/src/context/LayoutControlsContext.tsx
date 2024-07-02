import React from 'react';
import {ShiftMode} from "../utils/enums.ts";
import {Divider} from "../model/Divider.ts";
import {Voice} from "../model/Voice.ts";

export interface LayoutControlsContextProperties {
    toggleBreak: () => void;
    insertBreak: (position: number) => void;
    removeBreak: (position: number) => void;

    toggleDivider: () => void;
    insertDivider: (divider: Divider) => void;
    removeDivider: (position: number) => void;

    shiftNotes: (position: number, offset: number, voices: Voice[]) => void;
    shiftLyrics: (position: number, offset: number) => void;
    shiftLeft: (mode: ShiftMode) => void;
    shiftRight: (mode: ShiftMode) => void;
}

export const LayoutControlsContext = React.createContext<LayoutControlsContextProperties>({} as LayoutControlsContextProperties);
