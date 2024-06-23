import React, {useMemo, useState} from 'react';
import {Score} from "../models/Score";
import {ScoreContextProperties} from './ScoreContext';
import {HistoryContext, State} from "./HistoryContext";

interface Properties {
    children: React.ReactNode;
}

const HistoryContextProvider: React.FC<Properties> = ({children}) => {

    const MAX_ENTRIES = 20;
    const [undoStates, setUndoStates] = useState<State[]>([]);
    const [redoStates, setRedoStates] = useState<State[]>([]);
    const [recoverStates, setRecoverStates] = useState<State[]>([]);

    const push = (score: Score, activePosition: number, activeDuration: string, activeVoice: string) => {
        setUndoStates(prevHistory => {
            const newHistory = [...prevHistory, {
                score: structuredClone(score),
                activeVoice: activeVoice,
                activePosition: activePosition,
                activeDuration: activeDuration,
            }];
            if (newHistory.length > MAX_ENTRIES) {
                newHistory.shift();
            }
            return newHistory;
        });

        setRedoStates([]);
        setRecoverStates([]);
    }

    const undo = (context: ScoreContextProperties) => {
        setRecoverStates(prevHistory => [...prevHistory, {
            score: structuredClone(context.score),
            activeVoice: context.activeVoice,
            activePosition: context.activePosition,
            activeDuration: context.activeDuration,
        }]);

        setUndoStates(prevHistory => {
            const newHistory = [...prevHistory];
            const state = newHistory.pop();
            if (state) {
                context.setScore(state.score);
                context.setActiveVoice(state.activeVoice);
                context.setActivePosition(state.activePosition);
                context.setActiveDuration(state.activeDuration);
            }
            return newHistory;
        });

        setRedoStates(prevHistory => {
            const state = [...undoStates].pop();
            if (state) {
                return [...prevHistory, {
                    score: structuredClone(state.score),
                    activeVoice: state.activeVoice,
                    activePosition: state.activePosition,
                    activeDuration: state.activeDuration,
                }];
            }
            return prevHistory;
        });
    }

    const redo = (context: ScoreContextProperties) => {

        setUndoStates(prevHistory => {
            const state = [...redoStates].pop();
            if (state) {
                return [...prevHistory, {
                    score: structuredClone(state.score),
                    activeVoice: state.activeVoice,
                    activePosition: state.activePosition,
                    activeDuration: state.activeDuration,
                }];
            }
            return prevHistory;
        });

        setRedoStates(prevHistory => {
            const newHistory = [...prevHistory];
            newHistory.pop();
            return newHistory
        })

        setRecoverStates(prevHistory => {
            const newHistory = [...prevHistory];
            const state = newHistory.pop();
            if (state) {
                context.setScore(state.score);
                context.setActiveVoice(state.activeVoice);
                context.setActivePosition(state.activePosition);
                context.setActiveDuration(state.activeDuration);
            }
            return newHistory;
        });
    }

    const context = useMemo(() => ({
        undoStates, setUndoStates,
        redoStates, setRedoStates,
        recoverStates, setRecoverStates,
        push,
        undo,
        redo
    }), [undoStates, redoStates, recoverStates]);

    return (
        <HistoryContext.Provider value={context}>
            {children}
        </HistoryContext.Provider>);
}

export default HistoryContextProvider;