import React, {useMemo} from 'react';
import StaveLine from "./StaveLine.tsx";
import {Line} from "../../../../../model/Line.ts";
import {useScoreContext} from "../../../../../hooks/useScoreContext.tsx";
import {useDevMode} from "../../../../../hooks/useDevContext.tsx";
import {calculateStaveBlockCoords} from "../../../../../utils/calculation.helpers.tsx";
import {useLayoutParams} from "../../../../../hooks/useLayoutParams.tsx";

interface Properties {
    lines: Line[];
    index: number;
}

const StaveBlock: React.FC<Properties> = ({index, lines}) => {

    const context = useScoreContext();
    const {params} = useLayoutParams();
    const {isDevMode} = useDevMode();
    const breaksDependency = JSON.stringify(context.score.data.breaks);

    const {y} = useMemo(() => {
        return calculateStaveBlockCoords(index, context);
    }, [lines, breaksDependency, params]);

    return (
        <>
            {isDevMode &&
                <rect
                    height={params.CONTAINER_SYMBOLS_BAR}
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
                    height={params.CONTAINER_LYRICS_BAR}
                    width={context.dimensions.x}
                    y={y + context.dimensions.y - params.CONTAINER_LYRICS_BAR}
                    fill={"blue"}
                    opacity={0.2}
                />}
        </>
    )
};

export default StaveBlock;
