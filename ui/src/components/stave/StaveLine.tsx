import React from 'react';
import {Line} from "../../models/Line";
import {useScoreContext} from "../../context/ScoreContext";
import {Layout} from "../../utils/constants.ts";
import {useTranslation} from "react-i18next";

interface Properties {
    line: Line;
    offsetY: number;
}

const StaveLine: React.FC<Properties> = ({line, offsetY}) => {

    const [t] = useTranslation();
    const context = useScoreContext();

    const y = Layout.stave.container.SYMBOLS_BAR
        + (line.y - (line.detune || 0) / 100) * Layout.stave.line.SPACING
        + offsetY ;

    return (<g>
        {context.isEditMode && !context.isExportMode &&
            <text x={0} y={y + 5} fontSize={14} fill={"black"}>
                {t(`pitch.${line.pitch.toLowerCase()}`)}
            </text>}
            <line
                key={line.pitch}
                className={`hover-pointer`}
                x1={context.isEditMode ? 25 : 0} y1={y}
                x2={context.dimensions.x} y2={y}
                stroke={line.color}
                strokeWidth={line.strokeWidth}
                style={{zIndex: 5}}
            />
        </g>
    )
};

export default StaveLine;
