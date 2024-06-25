import React from 'react';
import {useScoreContext} from "../../../../../context/ScoreContext.tsx";
import {useTranslation} from "react-i18next";
import {ShortKey} from "../../../../../utils/keymap.ts";
import ControlButton from "../../../../../components/controls/ControlButton.tsx";
import {Group} from "@mantine/core";
import {DividerType} from "../../../../../model/Divider.ts";
import {Size} from "../../../../../utils/constants.ts";
import {FaDeleteLeft} from "react-icons/fa6";
import {RxDividerVertical} from "react-icons/rx";
import {GrReturn} from "react-icons/gr";
import {GoArrowLeft, GoArrowRight} from "react-icons/go";

const LayoutControls: React.FC = () => {

    const [t] = useTranslation();
    const context = useScoreContext();

    return (
        <Group gap={4}>
            <ControlButton
                tooltip={t("tooltip.insertBreak")}
                shortKey={ShortKey.BREAK}
                active={context.score.data.breaks.findIndex(p => p === context.activePosition) >= 0}
                onClick={() => context.toggleBreak()}
            >
                <GrReturn size={Size.icon.XS}/>
            </ControlButton>
            <ControlButton
                tooltip={t("tooltip.insertDivider")}
                shortKey={ShortKey.DIVIDER}
                active={context.score.data.dividers.findIndex(d => [DividerType.BAR, DividerType.SEPARATOR].includes(d.type)
                    && d.position === (context.activePosition)) >= 0}
                onClick={context.toggleDivider}
            >
                <RxDividerVertical size={Size.icon.XS}/>
            </ControlButton>
            <ControlButton
                tooltip={t("tooltip.shiftLeft")}
                shortKey={ShortKey.SHIFT_LEFT}
                onClick={context.shiftLeft}
            >
                <GoArrowLeft size={Size.icon.XS}/>
            </ControlButton>
            <ControlButton
                tooltip={t("tooltip.shiftRight")}
                shortKey={ShortKey.SHIFT_RIGHT}
                onClick={context.shiftRight}
            >
                <GoArrowRight size={Size.icon.XS}/>
            </ControlButton>
            <ControlButton
                tooltip={t("tooltip.removeNote")}
                shortKey={ShortKey.REMOVE_NOTE}
                disabled={!context.activeNote}
                onClick={() => context.removeNote(context.activePosition, true)}
            >
                <FaDeleteLeft size={Size.icon.XS}/>
            </ControlButton>
        </Group>
    )
};

export default LayoutControls;
