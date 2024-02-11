import React, {useState} from 'react';
import {useScoreContext} from "../../context/ScoreContext";
import {getBreakCoords} from "../../utils/helpers.tsx";
import {useTranslation} from "react-i18next";
import {useMantineTheme} from "@mantine/core";
import {Divider} from "../../models/Divider.ts";
import {Layout} from "../../utils/constants.ts";

interface Properties {
    position: number;
    blockIndex: number;
}

const Break: React.FC<Properties> = ({position, blockIndex}) => {

    // const [t] = useTranslation();
    // const theme = useMantineTheme();
    // const context = useScoreContext();
    //
    // const x = Layout.stave.container.PADDING_X_START
    //     + Layout.stave.note.SPACING * position
    //     - blockIndex
    //     - (index > 0 ? breaks[index - 1].position * Layout.stave.note.SPACING : 0);
    //
    // const y = context.dimensions.y * (index) + 20;
    //
    // const [isHovering, setIsHovering] = useState(false);

    return (<>
            {/*{context.isEditMode && <text*/}
            {/*    className={"hover-pointer"}*/}
            {/*    fontSize={18}*/}
            {/*    x={x}*/}
            {/*    y={y}*/}
            {/*    fill={isHovering ? theme.colors.red[9] : theme.black}*/}
            {/*    onClick={() => context.removeDivider(divider)}*/}
            {/*    onMouseOver={() => setIsHovering(true)}*/}
            {/*    onMouseLeave={() => setIsHovering(false)}*/}
            {/*>*/}
            {/*    {isHovering ? "✖" : "↵"}*/}
            {/*    <title>{t("tooltip.removeBreak")}</title>*/}
            {/*</text>}*/}
        </>
    )
};

export default Break;
