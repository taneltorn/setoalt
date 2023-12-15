import React from 'react';
import {getLineCoords} from "../../utils/helpers";
import {useScoreContext} from "../../context/ScoreContext";
import {Stave} from "../../models/Stave";
import {Layout} from "../../utils/constants";
import {useTranslation} from "react-i18next";

interface Properties {
    stave: Stave;
}

const StavePreview: React.FC<Properties> = ({stave}) => {

    const [t] = useTranslation();
    const context = useScoreContext();

    return (
        <svg width={200}>
            {stave.lines.map((line, index) => {
                let {y} = getLineCoords(line, 0, context);
                y = y - Layout.stave.container.SYMBOLS_BAR;

                return <g key={index}>
                    <text x={0} y={y} fontSize={14} fill={"black"}>
                        {t(`pitch.${line.pitch.toLowerCase()}`)}
                    </text>
                    <line
                        className={`hover-pointer`}
                        x1={30} y1={y}
                        x2={200} y2={y}
                        stroke={line.color}
                        strokeWidth={line.strokeWidth}
                    />
                </g>
            })}
        </svg>
    )
};

export default StavePreview;
