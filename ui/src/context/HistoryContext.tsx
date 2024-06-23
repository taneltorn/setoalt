import React, {useContext} from 'react';
import {isEmpty} from "../utils/helpers.tsx";
import {ScoreContextProperties} from "./ScoreContext";
import {Score} from "../models/Score";

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
}

export const HistoryContext = React.createContext<HistoryContextProperties>({} as HistoryContextProperties);

export const useHistory = () => {
    const context = useContext(HistoryContext);
    if (isEmpty(context)) {
        throw new Error('useHistoryContext must be used within a HistoryContextProvider')
    }

    return context;
};
