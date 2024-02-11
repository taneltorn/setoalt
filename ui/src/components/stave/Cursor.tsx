import React, {useMemo} from 'react';
import {Color, Layout} from "../../utils/constants";
import {useScoreContext} from "../../context/ScoreContext";
import {getCursorCoords, getLineCoords, getNoteTitle} from "../../utils/helpers.tsx";
import {useMantineTheme} from "@mantine/core";
import PreviewNote from "./PreviewNote.tsx";
import useMousePosition from "../../hooks/useMousePosition.tsx";
import {calculateCursorCoords, calculateDividerCoords} from "../../utils/stave.helpers.tsx";

const Cursor: React.FC = () => {

    const context = useScoreContext();
    const theme = useMantineTheme();
    // const {x,y} = getCursorCoords(context);
    // const { x} = useMousePosition(context.containerRef);
    const breaksDependency = JSON.stringify(context.score.data.breaks);

    const {x, y} = useMemo(() => {
        return calculateCursorCoords( context);
    }, [context.currentPosition, context.score.data.stave, breaksDependency]);

    return (<>
            <rect
                x={x}
                y={y}
                width={Layout.stave.cursor.WIDTH}
                height={Layout.stave.cursor.HEIGHT}
                // height={context.dimensions.y}
                fill={theme.colors.gray[2]}
                opacity={0.5}
                style={{zIndex: 1}}
            />
            {/*{context.score.data.stave.lines.map(line => {*/}
            {/*    const l = getLineCoords(line, 0, context);*/}
            {/*    return   <PreviewNote pitch={line.pitch} x={x+ 12} y={l.y}/>*/}
            {/*})}*/}

            {/*<circle*/}
            {/*    onMouseOver={() => setOpacity(1)}*/}
            {/*    onMouseLeave={() => setOpacity(0)}*/}
            {/*    className={"hover-pointer"}*/}
            {/*    cx={x + 12}*/}
            {/*    cy={30}*/}
            {/*    opacity={opacity}*/}
            {/*    r={Layout.stave.note.RADIUS}*/}
            {/*    fill={ "#000" }*/}
            {/*    onClick={() => {}}*/}
            {/*>*/}
            {/*    <title>LISA NOOT</title>*/}
            {/*</circle>*/}
        </>
    )
};

export default Cursor;
