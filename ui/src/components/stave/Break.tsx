import React, {useState} from 'react';
import {useScoreContext} from "../../context/ScoreContext";
import {getBreakCoords} from "../../utils/helpers.tsx";
import {useTranslation} from "react-i18next";
import {useMantineTheme} from "@mantine/core";

interface Properties {
    position: number;
}

const Break: React.FC<Properties> = ({position}) => {

    const [t] = useTranslation();
    const theme = useMantineTheme();
    const context = useScoreContext();
    const {x, y} = getBreakCoords(position, context);

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

export default Break;
