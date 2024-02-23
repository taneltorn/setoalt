import React from 'react';
import {Layout} from "../../../utils/constants.ts";
import {useDevMode} from "../../../context/DevModeContext.tsx";

interface Properties {
    x: number;
    y: number;
    fill: string;
    opacity: number;
    title: string;
    radius: number;
    onClick: () => void;
}

const HalfNote: React.FC<Properties> = ({x, y, fill, radius, opacity, title, onClick}) => {

    const {useHollowNotes} = useDevMode(); // todo remove

    return (<>
        {useHollowNotes
            ? <circle
                className={"hover-pointer"}
                cx={x}
                cy={y}
                r={radius  - Layout.stave.note.QUARTER_NOTE_STROKE / 2}
                fill={"white"}
                strokeWidth={Layout.stave.note.HALF_NOTE_STROKE}
                stroke={fill}
                opacity={opacity}
                onClick={onClick}
            >
                <title>{title}</title>
            </circle>
            : <circle
                className={"hover-pointer"}
                cx={x}
                cy={y}
                r={radius}
                fill={fill}
                opacity={opacity}
                onClick={onClick}
            >
                <title>{title}</title>
            </circle>}
    </>);
};

export default HalfNote;
