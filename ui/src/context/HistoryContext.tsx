import React, {useContext} from 'react';
import {isEmpty} from "../utils/helpers.tsx";
import {ScoreContextProperties} from "./ScoreContext";
import {Score} from "../models/Score";
import {Note} from "../models/Note";
import {Voice} from "../models/Voice";

export interface State {
    score: Score;
    activeNote?: Note;
    position: number;
    duration: string;
    voice: Voice;
}

export interface HistoryContextProperties {

    history: State[];
    push: (score: Score, position: number, note: Note | undefined, duration: string, voice: Voice) => void;
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
