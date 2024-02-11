import React, {useMemo, useState} from 'react';
import {useScoreContext} from "../../context/ScoreContext";
import {useTranslation} from "react-i18next";
import {useMantineTheme} from "@mantine/core";
import {Layout} from "../../utils/constants.ts";
import {getBlockNumber, getOffset} from "../../utils/helpers.tsx";
import {calculateBreakCoords, calculateDividerCoords} from "../../utils/stave.helpers.tsx";

interface Properties {
    position: number;
}

const StaveBreak: React.FC<Properties> = ({position}) => {

    const [t] = useTranslation();
    const theme = useMantineTheme();
    const context = useScoreContext();

    const breaksDependency = JSON.stringify(context.score.data.breaks);

    const {x, y} = useMemo(() => {
        return calculateBreakCoords(position, context)
    }, [position, context.score.data.stave, breaksDependency]);

    const [isHovering, setIsHovering] = useState(false);

    return (<>
            {context.isEditMode && <text
                className={"hover-pointer"}
                fontSize={18}
                x={x}
                y={y}
                fill={isHovering ? theme.colors.red[9] : theme.black}
                onClick={() => context.removeBreak(position)}
                onMouseOver={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                {isHovering ? "✖" : "↵"}
                <title>{t("tooltip.removeBreak")}</title>
            </text>}
        </>
    )
};

export default StaveBreak;
