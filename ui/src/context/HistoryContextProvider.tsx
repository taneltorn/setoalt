import React, {useMemo, useState} from 'react';
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

    const push = (score: Score, activeVoice: Voice, activePosition: number, activeDuration: string) => {
        console.log("pushing")
        if (history.length >= MAX_ENTRIES) {
            history.shift();
        }

        history.push({
            score: structuredClone(score),
            activeVoice: structuredClone(activeVoice),
            activePosition: activePosition,
            activeDuration: activeDuration,
        });

        setHistory(structuredClone(history));
        // setHistory({...history}); // strucuredClone needed?
    }

    const undo = (context: ScoreContextProperties) => {
        console.log("undo")

        if (history.length > 0) {
            const state = history.pop();
            console.log(state)
            if (state) {

                context.setScore(state.score);
                // context.setActiveVoice(state.activeVoice);
                context.setActivePosition(state.activePosition);
                context.setActiveDuration(state.activeDuration);
                setHistory(structuredClone(history));
                // setHistory({...history});
                // context.refresh();
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