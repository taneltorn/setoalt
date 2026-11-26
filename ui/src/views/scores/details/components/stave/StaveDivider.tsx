import React, {useMemo, useState} from 'react';
import {useTranslation} from "react-i18next";
import {useScoreContext} from "../../../../../hooks/useScoreContext.tsx";
import {Divider, DividerType} from "../../../../../model/Divider.ts";
import {useDevMode} from "../../../../../hooks/useDevContext.tsx";
import {calculateDividerCoords} from "../../../../../utils/calculation.helpers.tsx";
import {useLayoutControls} from "../../../../../hooks/useLayoutControls.tsx";
import {useMantineTheme} from "@mantine/core";
import {useLayoutParams} from "../../../../../hooks/useLayoutParams.tsx";

interface Properties {
    divider: Divider;
}

const StaveDivider: React.FC<Properties> = ({divider}) => {

    const [t] = useTranslation();
    const theme = useMantineTheme();
    const context = useScoreContext();
    const {params} = useLayoutParams();
    const {isDevMode} = useDevMode();
    const {removeDivider} = useLayoutControls();
    const [isHovering, setIsHovering] = useState(false);

    const height = divider.type === DividerType.SEPARATOR
        ? params.DIVIDER_SEPARATOR_HEIGHT
        : (context.score.data.stave.lines.at(-1)?.y || 0) * params.LINE_SPACING + params.DIVIDER_OVERFLOW_Y * 2;

    const {x, y} = useMemo(() => {
        return calculateDividerCoords(divider, context, params)
    }, [divider.type, context.score.data.stave, params]);

    return (
        <>
            {context.isEditMode &&
                <text x={x + 7}
                      y={y + 20}
                      fill={theme.colors.red[9]}
                      fontSize={18}>
                    {isHovering ? "✖" : ""}
                </text>}

            <rect
                x={x + 14}
                y={y}
                width={params.DIVIDER_WIDTH}
                height={height}
            />

            {context.isEditMode &&
                <rect
                    className={context.isEditMode ? "hover-pointer" : ""}
                    onClick={() => removeDivider(divider.position)}
                    onMouseOver={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    opacity={isDevMode ? 0.1 : 0}
                    x={x}
                    y={y}
                    width={params.DIVIDER_CONTAINER_WIDTH}
                    height={height}
                >
                    <title>{t("tooltip.removeDivider")}</title>
                </rect>}
        </>
    )
};

export default StaveDivider;
