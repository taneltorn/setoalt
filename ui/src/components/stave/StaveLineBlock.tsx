import React from 'react';
import {Line} from "../../models/Line";
import StaveLine from "./StaveLine.tsx";
import {useScoreContext} from "../../context/ScoreContext.tsx";
import {calculateLineBlockOffset} from "../../utils/calculation.helpers.tsx";

interface Properties {
    lines: Line[];
    index: number;
}

const StaveLineBlock: React.FC<Properties> = ({index, lines}) => {

    const context = useScoreContext();

    const offset = calculateLineBlockOffset(index, context);

    return (
        <>
            {lines.map(line =>
                <StaveLine
                    key={`line-${offset.y}-${line.pitch}`}
                    line={line}
                    offsetY={offset.y}
                />)}
        </>
    )
};

export default StaveLineBlock;
