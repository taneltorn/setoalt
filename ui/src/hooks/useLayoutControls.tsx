import React, {useContext, useMemo} from 'react';
import {durationToScalar, isEmpty} from "../utils/helpers.tsx";
import {useScoreContext} from "./useScoreContext.tsx";
import {ShiftMode} from "../utils/enums.ts";
import {Divider, DividerType} from "../model/Divider.ts";
import {DividerFactory} from "../utils/factories.ts";
import {useHistory} from "./useHistory.tsx";
import {LayoutControlsContext} from "../context/LayoutControlsContext.tsx";
import {Voice} from "../model/Voice.ts";

interface Properties {
    children: React.ReactNode;
}

export const LayoutControlsContextProvider: React.FC<Properties> = ({children}) => {

    const history = useHistory();
    const context = useScoreContext();

    const shiftNotes = (position: number, offset: number, voices: Voice[]) => {
        voices.forEach(voice => {
            voice.notes
                .filter(n => n.position > position)
                .forEach(n => {
                    n.position += offset;
                });
            voice.occupiedPositions = voice.occupiedPositions?.map(n => n > position ? (n + offset) : n);
        })
    }

    const shiftDividers = (position: number, offset: number) => {
        context.score.data.dividers
            .filter(divider => divider.position > position)
            .forEach(divider => {
                divider.position += offset;
            })
        context.refresh();
    }

    const shiftLyrics = (position: number, offset: number) => {
        const newPosition = position + offset;
        if (offset < 0 && (newPosition < 0 || context.score.data.lyrics.find(l => l.position === newPosition))) {
            return;
        }
        context.score.data.lyrics
            .filter(l => l.position >= position)
            .forEach(l => {
                l.position += offset;
            });
        context.activate(newPosition);
        context.refresh();
    }

    const shiftLeft = (mode: ShiftMode) => {
        history.snapshot(context);

        if (context.activePosition <= 0) return;

        if (mode === ShiftMode.LYRICS) {
            shiftLyrics(context.activePosition, -1);
            return;
        }

        if (!!context.getNote(context.activePosition - 1, context.activeVoice)) {
            return;
        }
        const voice = context.score.data.voices.find(v => v.name === context.activeVoice);
        if (voice) {
            const newPosition = context.activePosition - 1;
            if (!voice.occupiedPositions?.includes(newPosition)) {
                const voices = mode === ShiftMode.VOICES ? context.score.data.voices : [voice];
                shiftNotes(newPosition, -1, voices);
                context.activate(newPosition);
            }
        }

        if (mode === ShiftMode.VOICES) {
            shiftDividers(context.activePosition, -1);
        }
    }

    const shiftRight = (mode: ShiftMode) => {
        history.snapshot(context);

        if (context.activePosition < 0) return;

        if (mode === ShiftMode.LYRICS) {
            shiftLyrics(context.activePosition, 1);
            context.setActivePosition(context.activePosition + 1);
            return;
        }
        const voices = context.score.data.voices.filter(v => mode === ShiftMode.VOICES || v.name === context.activeVoice) || [];
        shiftNotes(context.activePosition - 0.5, 1, voices);
        context.setActivePosition(context.activePosition + 1);

        if (mode === ShiftMode.VOICES) {
            shiftDividers(context.activePosition, 1);
        }
    }

    const toggleBreak = () => {
        history.snapshot(context);

        const position = context.activeNote
            ? (context.activeNote.position + durationToScalar(context.activeNote.duration))
            : (context.activePosition + 1);
        const breakpoint = context.score.data.breaks.find(b => b === position);

        if (breakpoint) {
            removeBreak(position);
            return;
        }
        insertBreak(position);
    }

    const insertBreak = (position: number) => {
        context.score.data.breaks.push(position);
        context.score.data.breaks.sort((a, b) => a - b);
        context.refresh();
    }

    const removeBreak = (position: number) => {
        context.score.data.breaks = context.score.data.breaks.filter(b => b !== position);
        context.refresh();
    }

    const toggleDivider = () => {
        history.snapshot(context);

        const position = context.activeNote
            ? (context.activeNote.position + durationToScalar(context.activeNote.duration))
            : (context.activePosition + 1);

        const divider = context.score.data.dividers.find(it => it.position === position);
        if (divider) {
            if (divider.type === DividerType.BAR) {
                divider.type = DividerType.SEPARATOR;
            } else if (divider.type === DividerType.SEPARATOR) {
                removeDivider(position);
            }
            context.refresh();
            return;
        }
        insertDivider(DividerFactory.create(position, DividerType.BAR));
    }

    const insertDivider = (divider: Divider) => {
        context.score.data.dividers.push(divider);
        context.score.data.dividers.sort((a, b) => (a.position || 0) - (b.position || 0));
        context.refresh();
    }

    const removeDivider = (position: number) => {
        context.score.data.dividers = context.score.data.dividers.filter(d => d.position !== position);
        context.refresh();
    }

    const ctx = useMemo(() => ({
        toggleBreak,
        insertBreak,
        removeBreak,

        toggleDivider,
        insertDivider,
        removeDivider,

        shiftNotes,
        shiftLyrics,
        shiftLeft,
        shiftRight

    }), [context.score, context.activePosition]);

    return (
        <LayoutControlsContext.Provider value={ctx}>
            {children}
        </LayoutControlsContext.Provider>);
}

export const useLayoutControls = () => {
    const context = useContext(LayoutControlsContext);
    if (isEmpty(context)) {
        throw new Error('useLayoutControls must be used within a LayoutControlsContextProvider')
    }

    return context;
};
