import React, {useMemo, useState} from 'react';
import {useTranslation} from "react-i18next";
import {useScoreContext} from "../../../../context/ScoreContext.tsx";
import {Divider, DividerType} from "../../../../models/Divider.ts";
import {useDevMode} from "../../../../context/DevModeContext.tsx";
import {Color, Layout} from "../../../../utils/constants.ts";
import {calculateDividerCoords} from "../../../../utils/calculation.helpers.tsx";

interface Properties {
    divider: Divider;
}

const StaveDivider: React.FC<Properties> = ({divider}) => {

    const [t] = useTranslation();
    const {isDevMode} = useDevMode();
    const context = useScoreContext();
    const [isHovering, setIsHovering] = useState(false);

    const height = divider.type === DividerType.SEPARATOR
        ? Layout.stave.divider.SEPARATOR_HEIGHT
        : context.dimensions.y - Layout.stave.container.SYMBOLS_BAR - Layout.stave.container.LYRICS_BAR + Layout.stave.divider.SEPARATOR_HEIGHT;

    const {x, y} = useMemo(() => {
        return calculateDividerCoords(divider, context)
    }, [divider.type, context.score.data.stave]);

    return (
        <>
            {context.isEditMode &&
                <text x={x}
                      y={y + 20}
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
                opacity={isDevMode ? 0.1 : 0}
                x={x}
                y={y}
                width={Layout.stave.divider.CONTAINER_WIDTH}
                height={height}
            >
                <title>{t("tooltip.removeDivider")}</title>
            </rect>
        </>
    )
};

export default StaveDivider;
