import React, {useMemo} from 'react';
import StaveLine from "./StaveLine.tsx";
import {Line} from "../../../../model/Line.ts";
import {useScoreContext} from "../../../../context/ScoreContext.tsx";
import {useDevMode} from "../../../../context/DevModeContext.tsx";
import {calculateStaveBlockCoords} from "../../../../utils/calculation.helpers.tsx";
import {Layout} from "../../../../utils/constants.ts";
import {getDetuneLabel} from "../../../../utils/helpers.tsx";
import {useAudioContext} from "../../../../context/AudioContext.tsx";
import {useTranslation} from "react-i18next";

interface Properties {
    lines: Line[];
    index: number;
}

const StaveBlock: React.FC<Properties> = ({index, lines}) => {

    const {t} = useTranslation();
    const context = useScoreContext();
    const {transposition} = useAudioContext();
    const {isDevMode} = useDevMode();
    const breaksDependency = JSON.stringify(context.score.data.breaks);

    const {y} = useMemo(() => {
        return calculateStaveBlockCoords(index, context);
    }, [lines, breaksDependency]);

    return (
        <>
            {transposition && <g>
                <text x={0} y={y + Layout.stave.container.SYMBOLS_BAR - 30} fontSize={14} fontWeight={"bold"} fill={"black"}>
                    {getDetuneLabel(transposition,  t("unit.semitonesAbbr"))}
                </text>
            </g>}
            {isDevMode &&
                <rect
                    height={Layout.stave.container.SYMBOLS_BAR}
                    width={context.dimensions.x}
                    y={y}
                    fill={"green"}
                    opacity={0.2}
                />}
            {lines.map(line =>
                <StaveLine
                    key={`line-${y}-${line.pitch}`}
                    line={line}
                    offsetY={y}
                />)}

            {isDevMode &&
                <rect
                    height={Layout.stave.container.LYRICS_BAR}
                    width={context.dimensions.x}
                    y={y + context.dimensions.y - Layout.stave.container.LYRICS_BAR}
                    fill={"blue"}
                    opacity={0.2}
                />}
        </>
    )
};

export default StaveBlock;
