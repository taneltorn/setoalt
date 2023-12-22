import React, {useState} from 'react';
import {useScoreContext} from "../../context/ScoreContext";
import {getDividerCoords} from "../../utils/helpers.tsx";
import {Color, Layout} from "../../utils/constants";
import {useTranslation} from "react-i18next";

interface Properties {
    position: number;
}

const Divider: React.FC<Properties> = ({position}) => {

    const [t] = useTranslation();
    const context = useScoreContext();
    const {x, y} = getDividerCoords(position, context);
    const height = context.dimensions.y - Layout.lyrics.HEIGHT + 20;

    const [isHovering, setIsHovering] = useState(false);

    return (
        <>
            {context.isEditMode &&
                <text x={x}
                      y={y + 65}
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
                onClick={() => context.removeDivider(position)}
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

export default Divider;
