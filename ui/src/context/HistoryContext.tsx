import React from 'react';
import {Score} from "../model/Score";
import {ScoreContextProperties} from "./ScoreContext.tsx";

export interface State {
    score: Score;
    activePosition: number;
    activeDuration: string;
    activeVoice: string;
}

export interface HistoryContextProperties {
    undoStates: State[];
    redoStates: State[];
    recoverStates: State[];
    setUndoStates: (states: State[]) => void;
    setRedoStates: (states: State[]) => void;
    setRecoverStates: (states: State[]) => void;
    push: (score: Score, activePosition: number, activeDuration: string, activeVoice: string) => void;
    undo: (context: ScoreContextProperties) => void;
    redo: (context: ScoreContextProperties) => void;
    snapshot: (context: ScoreContextProperties) => void;
}

export const HistoryContext = React.createContext<HistoryContextProperties>({} as HistoryContextProperties);
