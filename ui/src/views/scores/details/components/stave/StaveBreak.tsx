import React, {useMemo} from 'react';
import {useTranslation} from "react-i18next";
import {useMantineTheme} from "@mantine/core";
import {useScoreContext} from "../../../../../hooks/useScoreContext.tsx";
import {calculateBreakCoords} from "../../../../../utils/calculation.helpers.tsx";
import {useLayoutControls} from "../../../../../hooks/useLayoutControls.tsx";
import {useHover} from "@mantine/hooks";

interface Properties {
    position: number;
}

const StaveBreak: React.FC<Properties> = ({position}) => {

    const [t] = useTranslation();
    const theme = useMantineTheme();
    const context = useScoreContext();
    const {removeBreak} = useLayoutControls();
    const {hovered, ref} = useHover();
    const breaksDependency = JSON.stringify(context.score.data.breaks);

    const {x, y} = useMemo(() => {
        return calculateBreakCoords(position, context)
    }, [position, context.score.data.stave, breaksDependency]);

    return (<>
            {context.isEditMode &&
                <text
                    // @ts-ignore
                    ref={ref}
                    className={"hover-pointer"}
                    fontSize={18}
                    x={x}
                    y={y}
                    fill={hovered ? theme.colors.red[9] : theme.black}
                    onClick={() => removeBreak(position)}
                >
                    {hovered ? "✖" : "↵"}
                    <title>{t("tooltip.removeBreak")}</title>
                </text>}
        </>
    )
};

export default StaveBreak;
