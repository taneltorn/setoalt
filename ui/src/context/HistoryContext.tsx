import React, {useContext} from 'react';
import {isEmpty} from "../utils/helpers.tsx";
import {ScoreContextProperties} from "./ScoreContext";
import {Score} from "../models/Score";
import {Voice} from "../models/Voice";

export interface State {
    score: Score;
    activeVoice: Voice;
    activePosition: number;
    activeDuration: string;
}

export interface HistoryContextProperties {
    history: State[];
    push: (score: Score, activeVoice: Voice, activePosition: number, activeDuration: string) => void;
    undo: (context: ScoreContextProperties) => void;
}

export const HistoryContext = React.createContext<HistoryContextProperties>({} as HistoryContextProperties);

export const useHistoryContext = () => {
    const context = useContext(HistoryContext);
    if (isEmpty(context)) {
        throw new Error('useHistoryContext must be used within a HistoryContextProvider')
    }

    return context;
};
