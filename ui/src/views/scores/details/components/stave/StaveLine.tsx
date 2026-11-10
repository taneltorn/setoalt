import React from 'react';
import {useTranslation} from "react-i18next";
import {useScoreContext} from "../../../../../hooks/useScoreContext.tsx";
import {Line} from "../../../../../model/Line.ts";
import DetuneIndicator from "./DetuneIndicator.tsx";
import {useLayoutParams} from "../../../../../hooks/useLayoutParams.tsx";

interface Properties {
    line: Line;
    offsetY: number;
}

const StaveLine: React.FC<Properties> = ({line, offsetY}) => {

    const [t] = useTranslation();
    const {params} = useLayoutParams();
    const context = useScoreContext();

    const y = params.CONTAINER_SYMBOLS_BAR
        + line.y * params.LINE_SPACING
        + offsetY;

    return (<g>

            {!context.isSimplifiedMode && <>
                <text x={0} y={y + 5} fontSize={10} fill={"black"}>
                    {t(`pitch.${line.pitch.toLowerCase()}`)}
                </text>

                {line.detune &&
                    <DetuneIndicator
                        detune={line.detune}
                        x={8}
                        y={y + (line.detune > 0 ? (params.LINE_SPACING + 3) : (params.LINE_SPACING))}
                        opacity={1}
                        color={"black"}
                    />}
            </>}
            <line
                key={line.pitch}
                className={`hover-pointer`}
                x1={(!context.isSimplifiedMode ? params.CONTAINER_PADDING_X_START : 0) - params.NOTE_SPACING / 1.5}
                y1={y}
                x2={context.dimensions.x} y2={y}
                stroke={line.color}
                strokeWidth={line.strokeWidth}
            />
        </g>
    )
};

export default StaveLine;
