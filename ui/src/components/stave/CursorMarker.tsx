import React, {useMemo} from 'react';
import {Layout} from "../../utils/constants";
import {useScoreContext} from "../../context/ScoreContext";
// import {useMantineTheme} from "@mantine/core";
import {calculateCursorCoords} from "../../utils/calculation.helpers.tsx";
import CursorNote from "./CursorNote.tsx";
import {useAudioContext} from "../../context/AudioContext.tsx";
import {useDevMode} from "../../context/DevModeContext.tsx";

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

    return (<>
            <rect
                x={x - Layout.stave.note.SPACING / 2 - Layout.stave.note.RADIUS / 2}
                y={y}
                width={Layout.stave.note.SPACING * 1.5}
                height={Layout.stave.cursor.HEIGHT}
                opacity={isDevMode ? 0.1 : 0}
                fill={"gray"}
                style={{zIndex: 1}}
                onClick={handleSelect}
            />
            {context.isEditMode && context.score.data.stave.lines.map(line =>
                <CursorNote
                    key={line.pitch}
                    pitch={line.pitch} x={x}
                    y={y}
                />)}
        </>
    )
};

export default CursorMarker;
