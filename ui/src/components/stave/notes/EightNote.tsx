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

const EightNote: React.FC<Properties> = ({x, y, fill, opacity, title, onClick}) => {

    return (
        <circle
            className={"hover-pointer"}
            cx={x}
            cy={y}
            r={Layout.stave.note.RADIUS}
            fill={fill}
            opacity={opacity}
            onClick={onClick}
        >
            <title>{title}</title>
        </circle>
    );
};

export default EightNote;
