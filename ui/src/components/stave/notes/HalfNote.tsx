import React from 'react';
import {Layout} from "../../../utils/constants.ts";

interface Properties {
    x: number;
    y: number;
    fill: string;
    opacity: number;
    title: string;
    onClick: () => void;
}

const HalfNote: React.FC<Properties> = ({x, y, fill, opacity, title, onClick}) => {

    const strokeWidth = Layout.stave.note.HALF_NOTE_STROKE;

    return (<>
        <circle
            className={"hover-pointer"}
            cx={x}
            cy={y}
            r={Layout.stave.note.RADIUS - strokeWidth / 2}
            fill={"white"}
            strokeWidth={strokeWidth}
            stroke={fill}
            opacity={opacity}
            onClick={onClick}
        >
            <title>{title}</title>
        </circle>
    </>);
};

export default HalfNote;
