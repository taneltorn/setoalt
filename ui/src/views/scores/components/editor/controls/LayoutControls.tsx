import React from 'react';
import {useScoreContext} from "../../../../../context/ScoreContext.tsx";
import {useTranslation} from "react-i18next";
import {ShortKey} from "../../../../../utils/keymap.ts";
import ControlButton from "../../../../../components/controls/ControlButton.tsx";
import {Group, Text} from "@mantine/core";
import {DividerType} from "../../../../../model/Divider.ts";
import {Size} from "../../../../../utils/constants.ts";
import {FaDeleteLeft} from "react-icons/fa6";
import {RxDividerVertical} from "react-icons/rx";
import {GrReturn} from "react-icons/gr";
import {GoArrowLeft, GoArrowRight} from "react-icons/go";
import {ShiftMode} from "../../../../../utils/enums.ts";

const LayoutControls: React.FC = () => {

    const [t] = useTranslation();
    const context = useScoreContext();

    const handleShiftLeft = (e: any) => {
        return context.shiftLeft(e.ctrlKey ? ShiftMode.LYRICS : ShiftMode.NOTES);
    }

    const handleShiftRight = (e: any) => {
        return context.shiftRight(e.ctrlKey ? ShiftMode.LYRICS : ShiftMode.NOTES);
    }

    return (
        <Group gap={2}>
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
                tooltip={t(`tooltip.${context.isCtrlKeyActive ? "shiftLyricsLeft" : "shiftLeft"}`)}
                shortKey={ShortKey.SHIFT_LEFT}
                onClick={handleShiftLeft}
            >

                <GoArrowLeft size={Size.icon.XS}/>
                {context.isCtrlKeyActive && <Text>ᵃᵇ</Text>}
            </ControlButton>
            <ControlButton
                tooltip={t(`tooltip.${context.isCtrlKeyActive ? "shiftLyricsRight" : "shiftRight"}`)}
                shortKey={ShortKey.SHIFT_RIGHT}
                onClick={handleShiftRight}
            >
                {context.isCtrlKeyActive && <Text>ᵃᵇ</Text>}
                <GoArrowRight size={Size.icon.XS}/>
            </ControlButton>
            <ControlButton
                tooltip={t("tooltip.removeNote")}
                shortKey={ShortKey.REMOVE_NOTE}
                onClick={() => context.removeNote(context.activePosition, true)}
            >
                <FaDeleteLeft size={Size.icon.XS}/>
            </ControlButton>
        </Group>
    )
};

export default LayoutControls;
