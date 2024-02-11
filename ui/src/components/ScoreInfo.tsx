import React from "react";
import {useScoreContext} from "../context/ScoreContext.tsx";
import useMousePosition from "../hooks/useMousePosition.tsx";

const ScoreInfo: React.FC = () => {

    const context = useScoreContext();
    // const { x, y, cx, cy } = useMousePosition(context.containerRef);

    return (
        <div style={{padding: "10px 15px", backgroundColor: "#f9f9f9    ", borderRadius: "16px"}}>
            {/*<p>Cursor position: {x} ({cx}) / {y} ({cy})</p>*/}
            <p>Current position: {context.currentPosition}</p>
            <p>Current note: {JSON.stringify(context.currentNote)}</p>
            <p>Breaks: {JSON.stringify(context.score.data.breaks)}</p>
            <p>Notes: {JSON.stringify(context.score.data.voices.flatMap(v => v.notes).map(n => n.position))}</p>

            <p>{JSON.stringify(context.dimensions)}</p>
            {JSON.stringify(context.score)}
        </div>
    );
}

export default ScoreInfo;
