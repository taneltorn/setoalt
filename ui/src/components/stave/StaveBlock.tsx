import React from 'react';
import {Line} from "../../models/Line";
import StaveLine from "./StaveLine.tsx";
import {useScoreContext} from "../../context/ScoreContext.tsx";
import {calculateOffset, getOffset} from "../../utils/helpers.tsx";

interface Properties {
    lines: Line[];
    index: number;
}

const StaveBlock: React.FC<Properties> = ({index, lines}) => {

    const context = useScoreContext();

    const offset = calculateOffset(index, context);

    return (
        <>
            {/*{context.score.data.breaks*/}
            {/*    .map((p, i) =>*/}
            {/*        <StaveBreak*/}
            {/*            key={`break-${p}`}*/}
            {/*            position={p}*/}
            {/*            // index={index}*/}
            {/*        />)}*/}

            {/*{context.score.data.dividers*/}
            {/*    .filter(d => d.type === DividerType.BREAK)*/}
            {/*    .map(d =>*/}
            {/*        <Break key={`break-${d.position}`} blockIndex={index} position={d.position}/>)}*/}


            {lines.map(line =>
                <StaveLine
                    key={`line-${offset.y}-${line.pitch}`}
                    line={line}
                    offsetY={offset.y}
                />)}
        </>
    )
};

export default StaveBlock;
