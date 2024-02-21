import React from "react";

interface Properties {
    x: number;
    y: number;
    fill: string;
    opacity: number;
    title: string;
    radius: number;
    onClick: () => void;
}

const EightNote: React.FC<Properties> = ({x, y, fill, radius, opacity, title, onClick}) => {

    return (
        <circle
            className={"hover-pointer"}
            cx={x}
            cy={y}
            r={radius}
            fill={fill}
            opacity={opacity}
            onClick={onClick}
        >
            <title>{title}</title>
        </circle>
    );
};

export default EightNote;
