import React from 'react';
import {Color, Layout} from "../../utils/constants";
import {useScoreContext} from "../../context/ScoreContext";
import {getCursorCoords, getLineCoords, getNoteTitle} from "../../utils/helpers.tsx";
import {useMantineTheme} from "@mantine/core";
import PreviewNote from "./PreviewNote.tsx";
import useMousePosition from "../../hooks/useMousePosition.tsx";

const NotePreviewBar: React.FC = () => {

    const context = useScoreContext();
    const { y} = getCursorCoords(context);

    return (<>

            {context.score.data.stave.lines.map(line => {
                const l = getLineCoords(line, 0, context);
                return   <PreviewNote pitch={line.pitch} y={l.y}/>
            })}

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

export default NotePreviewBar;
