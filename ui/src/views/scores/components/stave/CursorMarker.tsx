import React, {useMemo} from 'react';
import PreviewNote from "./PreviewNote.tsx";
import {useAudioContext} from "../../../../context/AudioContext.tsx";
import {useScoreContext} from "../../../../context/ScoreContext.tsx";
import {calculateCursorCoords} from "../../../../utils/calculation.helpers.tsx";
import {Layout} from "../../../../utils/constants.ts";
import {useDevMode} from "../../../../context/DevModeContext.tsx";

const CursorMarker: React.FC = () => {

    const context = useScoreContext();
    const audioContext = useAudioContext();
    const {isDevMode} = useDevMode();
    const breaksDependency = JSON.stringify(context.score.data.breaks);

    const {x, y} = useMemo(() => {
        return calculateCursorCoords(context);
    }, [context.cursorPosition, context.score.data.stave, breaksDependency]);

    const handleSelect = () => {
        if (!context.isEditMode) {
            audioContext.playPosition(context.score, context.cursorPosition);
            context.selectPosition(context.cursorPosition);
            return;
        }
        context.selectPosition(context.cursorPosition);
    }

    const showNote = useMemo(() => {
        if (!context.isEditMode) return false;

        const note = context.getNote(context.cursorPosition, context.currentVoice);
        if (note) return true;

        return !context.currentVoice.occupiedPositions?.includes(context.cursorPosition);
    }, [context.isEditMode, context.cursorPosition, context.currentVoice]);

    return (<>
            <rect
                x={x - Layout.stave.note.SPACING / 2 - Layout.stave.note.RADIUS / 2}
                y={y}
                width={Layout.stave.note.SPACING * 1.5}
                height={context.dimensions.y}
                opacity={isDevMode ? 0.1 : 0.05}
                fill={"gray"}
                onClick={handleSelect}
            />

            {showNote && context.score.data.stave.lines.map(line =>
                <PreviewNote
                    key={line.pitch}
                    pitch={line.pitch} x={x}
                    y={y}
                />)}
        </>
    )
};

export default CursorMarker;
