import React, {useMemo} from 'react';
import {Layout} from "../../utils/constants";
import {useScoreContext} from "../../context/ScoreContext";
import {useMantineTheme} from "@mantine/core";
import {calculateCursorCoords} from "../../utils/calculation.helpers.tsx";
import CursorNote from "./CursorNote.tsx";

const CursorMarker: React.FC = () => {

    const context = useScoreContext();
    const theme = useMantineTheme();
    const breaksDependency = JSON.stringify(context.score.data.breaks);

    const {x, y} = useMemo(() => {
        return calculateCursorCoords(context);
    }, [context.cursorPosition, context.score.data.stave, breaksDependency]);

    return (<>
            <rect
                x={x}
                y={y}
                width={Layout.stave.cursor.WIDTH}
                height={Layout.stave.cursor.HEIGHT}
                fill={theme.colors.gray[2]}
                opacity={0.5}
                style={{zIndex: 1}}
            />
            <rect
                x={x - Layout.stave.note.SPACING / 2}
                y={y}
                width={Layout.stave.note.SPACING * 1.5}
                height={Layout.stave.cursor.HEIGHT}
                opacity={0}
                style={{zIndex: 1}}
                onClick={() => context.selectPosition(context.cursorPosition)}
            />
            {context.score.data.stave.lines.map(line => <CursorNote key={line.pitch} pitch={line.pitch} x={x} y={y}/>)}
        </>
    )
};

export default CursorMarker;
