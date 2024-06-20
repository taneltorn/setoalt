import React, {useMemo, useState} from 'react';
import {Note} from "../models/Note";
import {Score} from "../models/Score";
import {Voice} from "../models/Voice";
import {ScoreContextProperties} from './ScoreContext';
import {HistoryContext, State} from "./HistoryContext";

interface Properties {
    children: React.ReactNode;
}

// todo IMPLEMENT IN FUTURE
const HistoryContextProvider: React.FC<Properties> = ({children}) => {

    const MAX_ENTRIES = 10;
    const [history, setHistory] = useState<State[]>([]);

    const push = (score: Score, position: number, note: Note | undefined, duration: string, voice: Voice) => {
        if (history.length >= MAX_ENTRIES) {
            history.shift();
        }
        history.push({
            score: structuredClone(score),
            activeNote: structuredClone(note),
            position: position,
            voice: structuredClone(voice),
            duration: duration,
        });
        setHistory({...history});
    }

    const undo = (context: ScoreContextProperties) => {
        if (history.length > 0) {
            const state = history.pop();
            if (state) {
                // todo why is clone needed here for triggering rerender?
                context.setScore(structuredClone(state.score));
                context.setActiveVoice(structuredClone(state.voice));
                context.setActivePosition(state.position);
                // context.setD(state.duration);
                setHistory({...history});
            }
        }
    }

    const context = useMemo(() => ({
        history,
        push,
        undo
    }), [history]);

    return (
        <HistoryContext.Provider value={context}>
            {children}
        </HistoryContext.Provider>);
}

export default HistoryContextProvider;