import React, {useMemo, useState} from 'react';
import {Layout} from "../../utils/constants";
import {useScoreContext} from "../../context/ScoreContext";
import {calculateCursorNoteCoords} from "../../utils/calculation.helpers.tsx";
import {useDevMode} from "../../context/DevModeContext.tsx";
import useCursorCoords from "../../hooks/useCursorCoords.tsx";

interface Properties {
    pitch: string;
    x: number;
    y: number;
}

const CursorNote: React.FC<Properties> = ({pitch, ...props}) => {

    const context = useScoreContext();
    const {isDevMode} = useDevMode();
    const [opacity, setOpacity] = useState<number>(isDevMode ? 0.2 : 0);

    const coords = useCursorCoords(context.containerRef);

    const {x, y} = useMemo(() => {
        return calculateCursorNoteCoords(pitch, props.x, props.y, context);
    }, [pitch, props.x, props.y]);

    return (<>
        {context.cursorPosition >= 0 && coords.x <= 20 && <>
            <circle
                className={"hover-pointer"}
                cx={x}
                cy={y}
                opacity={isDevMode ? Math.max(opacity, 0.2) : opacity}
                r={Layout.stave.note.RADIUS}
            >
                <title>{pitch}</title>
            </circle>
            <rect
                className={"hover-pointer"}
                x={x - 50}
                y={y - 10}
                opacity={isDevMode ? 0.1 : 0}
                onMouseOver={() => setOpacity(0.5)}
                onMouseLeave={() => setOpacity(0)}
                r={Layout.stave.note.RADIUS * 2.5}
                height={40}
                fill={"red"}
                width={100}
                onClick={() => context.insertOrUpdateNote(pitch, context.cursorPosition, true)}
            />
        </>}
    </>);
};

export default CursorNote;
