import React, {useMemo, useState} from 'react';
import {useScoreContext} from "../../context/ScoreContext";
import {Color, Layout} from "../../utils/constants";
import {useTranslation} from "react-i18next";
import {Divider, DividerType} from "../../models/Divider.ts";
import {calculateDividerCoords} from "../../utils/calculation.helpers.tsx";

interface Properties {
    divider: Divider;
}

const StaveDivider: React.FC<Properties> = ({divider}) => {

    const [t] = useTranslation();
    const context = useScoreContext();
    const [isHovering, setIsHovering] = useState(false);

    const height = divider.type === DividerType.SEPARATOR
        ? Layout.stave.divider.SEPARATOR_HEIGHT
        : Layout.stave.divider.BAR_HEIGHT;

    const {x, y} = useMemo(() => {
        return calculateDividerCoords(divider, context)
    }, [divider, context.score.data.stave]);

    return (
        <>
            {context.isEditMode &&
                <text x={x}
                      y={y + 15}
                      fill={Color.accent.PRIMARY}
                      fontSize={18}>
                    {isHovering ? "✖" : ""}
                </text>}

            <rect
                x={x + 7}
                y={y}
                width={Layout.stave.divider.WIDTH}
                height={height}
            />

            <rect
                className={context.isEditMode ? "hover-pointer" : ""}
                onClick={() => context.removeDivider(divider.position)}
                onMouseOver={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                opacity={0}
                x={x}
                y={y}
                width={Layout.stave.divider.CONTAINER_WIDTH}
                height={height}
            >
                <title>{t("editor.tooltip.removeDivider")}</title>
            </rect>
        </>
    )
};

export default StaveDivider;
