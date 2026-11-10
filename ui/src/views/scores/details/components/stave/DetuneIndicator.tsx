import React from 'react';
import {useLayoutParams} from "../../../../../hooks/useLayoutParams.tsx";

interface Properties {
    detune: number
    opacity: number
    x: number;
    y: number;
    color?: string;
}

const DetuneIndicator: React.FC<Properties> = ({x, y, detune, opacity, color}) => {

    const size = 20;
    const {params} = useLayoutParams();

    return (
        <svg
            x={x + 0.5 * params.NOTE_RADIUS}
            y={y - (detune > 0 ? 3 : 3.5) * params.NOTE_RADIUS}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke={color || "black"}
            opacity={opacity}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {detune > 0
                ? <path d="M12 14V5M9 8l3-3 3 3"/>
                : <path d="M12 10v9M15 16l-3 3-3-3"/>}
        </svg>
    ) ;
};

export default DetuneIndicator;
