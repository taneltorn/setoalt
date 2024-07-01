import React from 'react';
import {useTranslation} from "react-i18next";
import {useScoreContext} from "../../../../context/ScoreContext.tsx";
import {Line} from "../../../../model/Line.ts";
import {Layout} from "../../../../utils/constants.ts";
// import {getDetuneLabel} from "../../../../utils/helpers.tsx";
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
                <text x={0} y={y + 5} fontSize={14} fill={"black"}>
                    {t(`pitch.${line.pitch.toLowerCase()}`)}
                </text>

                {line.detune &&
                    <DetuneIndicator
                        detune={line.detune}
                        x={8}
                        y={y + 8}
                        opacity={1}
                        color={"black"}
                    />}

                {/*{line.detune &&*/}
                {/*    <text x={20} y={y + 5} fontSize={10} fill={"black"}>*/}
                {/*        {getDetuneLabel(line.detune, t("unit.centsAbbr"))}*/}
                {/*    </text>}*/}
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
