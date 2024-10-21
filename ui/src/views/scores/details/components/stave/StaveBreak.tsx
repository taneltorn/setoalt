import React, {useMemo, useState} from 'react';
import {useTranslation} from "react-i18next";
import {useMantineTheme} from "@mantine/core";
import {useScoreContext} from "../../../../../hooks/useScoreContext.tsx";
import {calculateBreakCoords} from "../../../../../utils/calculation.helpers.tsx";
import {useLayoutControls} from "../../../../../hooks/useLayoutControls.tsx";

interface Properties {
    position: number;
}

const StaveBreak: React.FC<Properties> = ({position}) => {

    const [t] = useTranslation();
    const theme = useMantineTheme();
    const context = useScoreContext();
    const {removeBreak} = useLayoutControls();

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
                onClick={() => removeBreak(position)}
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
