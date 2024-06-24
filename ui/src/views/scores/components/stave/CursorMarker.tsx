import React, {useMemo} from 'react';
import PreviewNote from "./PreviewNote.tsx";
import {useScoreContext} from "../../../../context/ScoreContext.tsx";
import {calculateCursorCoords} from "../../../../utils/calculation.helpers.tsx";
import {Layout} from "../../../../utils/constants.ts";
import {useAudioContext} from "../../../../context/AudioContext.tsx";

const CursorMarker: React.FC = () => {

    const context = useScoreContext();
    const {stopPlayback} = useAudioContext();
    const breaksDependency = JSON.stringify(context.score.data.breaks);

    const {x, y} = useMemo(() => {
        return calculateCursorCoords(context);
    }, [context.cursorPosition, context.score.data.stave, breaksDependency]);

    const showNote = useMemo(() => {
        if (!context.isEditMode) return false;

        const note = context.getNote(context.cursorPosition, context.activeVoice);
        if (note) return true;

        return !context.score.data.voices.find(v => v.name === context.activeVoice)?.occupiedPositions?.includes(context.cursorPosition);
    }, [context.isEditMode, context.cursorPosition, context.activeVoice]);

    const handleClick = (event: any) => {
        if (event.ctrlKey) {
            context.updateLoopRange(context.loopRange?.start || context.activePosition, context.cursorPosition);
            stopPlayback();
            return;
        }
        context.activate(context.cursorPosition);
    }

    return (<>
            <rect
                x={x - Layout.stave.note.SPACING / 2 - Layout.stave.note.RADIUS / 2}
                // x={x}
                y={y}
                width={Layout.stave.note.SPACING * 1.5}
                height={context.dimensions.y}
                opacity={x >= (Layout.stave.container.PADDING_X_START - Layout.stave.note.SPACING) ? 0.05 : 0}
                fill={"gray"}
                onClick={event => handleClick(event)}
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
