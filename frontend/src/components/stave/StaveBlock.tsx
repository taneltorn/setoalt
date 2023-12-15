import React from 'react';
import {Line} from "../../models/Line";
import {getLineCoords} from "../../utils/helpers";
import {useScoreContext} from "../../context/ScoreContext";

interface Properties {
    lines: Line[];
    y: number;
}

const StaveBlock: React.FC<Properties> = (props) => {

    const context = useScoreContext();

    return (
        <>
            {props.lines.map(line => {
                const {x, y} = getLineCoords(line, props.y, context);
                return <line
                    className={`hover-pointer`}
                    key={line.pitch}
                    x1={0} y1={y}
                    x2={x} y2={y}
                    stroke={line.color}
                    strokeWidth={line.strokeWidth}
                />
            })}
        </>
    )
};

export default StaveBlock;
