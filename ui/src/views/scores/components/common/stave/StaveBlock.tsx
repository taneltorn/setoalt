import React, {useMemo} from 'react';
import {Line} from "../../../../../models/Line.ts";
import StaveLine from "./StaveLine.tsx";
import {useScoreContext} from "../../../../../context/ScoreContext.tsx";
import {calculateStaveBlockCoords} from "../../../../../utils/calculation.helpers.tsx";
import {Layout} from "../../../../../utils/constants.ts";
import {useDevMode} from "../../../../../context/DevModeContext.tsx";

interface Properties {
    lines: Line[];
    index: number;
}

const StaveBlock: React.FC<Properties> = ({index, lines}) => {

    const context = useScoreContext();
    const {isDevMode} = useDevMode();
    const breaksDependency = JSON.stringify(context.score.data.breaks);

    const {y} = useMemo(() => {
        return calculateStaveBlockCoords(index, context);
    }, [lines, breaksDependency]);

    return (
        <>
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
