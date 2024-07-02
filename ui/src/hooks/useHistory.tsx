import React, {useContext, useMemo, useState} from 'react';
import {Score} from "../model/Score.ts";
import {HistoryContext, State} from "../context/HistoryContext.tsx";
import {isEmpty} from "../utils/helpers.tsx";
import {ScoreContextProperties} from "../context/ScoreContext.tsx";

interface Properties {
    children: React.ReactNode;
}

export const HistoryContextProvider: React.FC<Properties> = ({children}) => {

    const MAX_ENTRIES = 30;
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

    const snapshot = (context: ScoreContextProperties) => {
        push(context.score, context.activePosition, context.activeDuration, context.activeVoice);
    }

    const context = useMemo(() => ({
        undoStates, setUndoStates,
        redoStates, setRedoStates,
        recoverStates, setRecoverStates,
        push,
        undo,
        redo,
        snapshot,
    }), [undoStates, redoStates, recoverStates]);

    return (
        <HistoryContext.Provider value={context}>
            {children}
        </HistoryContext.Provider>);
}

export const useHistory = () => {
    const context = useContext(HistoryContext);
    if (isEmpty(context)) {
        throw new Error('useHistoryContext must be used within a UseHistory')
    }

    return context;
};
