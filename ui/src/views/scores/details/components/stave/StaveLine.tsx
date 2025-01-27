import React from 'react';
import {useTranslation} from "react-i18next";
import {useScoreContext} from "../../../../../hooks/useScoreContext.tsx";
import {Line} from "../../../../../model/Line.ts";
import {Layout} from "../../../../../utils/constants.ts";
import DetuneIndicator from "./DetuneIndicator.tsx";

interface Properties {
    line: Line;
    offsetY: number;
}

const StaveLine: React.FC<Properties> = ({line, offsetY}) => {

    const [t] = useTranslation();
    const context = useScoreContext();

    const y = Layout.stave.container.SYMBOLS_BAR
        + line.y * Layout.stave.line.SPACING
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
                        y={y + (line.detune > 0 ? (Layout.stave.line.SPACING + 3) : (Layout.stave.line.SPACING))}
                        opacity={1}
                        color={"black"}
                    />}
            </>}
            <line
                key={line.pitch}
                className={`hover-pointer`}
                x1={(!context.isSimplifiedMode ? Layout.stave.container.PADDING_X_START : 0) - Layout.stave.note.SPACING / 1.5}
                y1={y}
                x2={context.dimensions.x} y2={y}
                stroke={line.color}
                strokeWidth={line.strokeWidth}
            />
        </g>
    )
};

export default StaveLine;
