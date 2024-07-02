import React from 'react';
import {useScoreContext} from "../../../../../hooks/useScoreContext.tsx";
import {useTranslation} from "react-i18next";
import {ShortKey} from "../../../../../utils/keymap.ts";
import ControlButton from "../../../../../components/controls/ControlButton.tsx";
import {Group} from "@mantine/core";
import {DividerType} from "../../../../../model/Divider.ts";
import {Size} from "../../../../../utils/constants.ts";
import {FaDeleteLeft} from "react-icons/fa6";
import {RxDividerVertical} from "react-icons/rx";
import {GrReturn} from "react-icons/gr";
import {ShiftMode} from "../../../../../utils/enums.ts";
import {useLayoutControls} from "../../../../../hooks/useLayoutControls.tsx";
import {useNoteControls} from "../../../../../hooks/useNoteControls.tsx";
import {useActiveKeys} from "../../../../../hooks/useActiveKeys.tsx";
import {ShiftLeftIcons, ShiftRightIcons} from "../../../../../utils/icons.tsx";

const LayoutControls: React.FC = () => {

    const [t] = useTranslation();
    const {isCtrlKeyActive, isShiftKeyActive} = useActiveKeys();
    const {activePosition, score} = useScoreContext();
    const {removeNote} = useNoteControls();
    const {shiftLeft, shiftRight, toggleBreak, toggleDivider} = useLayoutControls();

    const handleShiftLeft = (e: any) => {
        return shiftLeft(e.shiftKey
            ? ShiftMode.VOICES
            : (e.ctrlKey ? ShiftMode.LYRICS : ShiftMode.NOTES));
    }

    const handleShiftRight = (e: any) => {
        return shiftRight(e.shiftKey
            ? ShiftMode.VOICES
            : (e.ctrlKey ? ShiftMode.LYRICS : ShiftMode.NOTES));
    }

    return (
        <Group gap={4}>
            <ControlButton
                tooltip={t("tooltip.insertBreak")}
                shortKey={ShortKey.BREAK}
                active={score.data.breaks.findIndex(p => p === activePosition) >= 0}
                onClick={() => toggleBreak()}
            >
                <GrReturn size={Size.icon.XS}/>
            </ControlButton>
            <ControlButton
                tooltip={t("tooltip.insertDivider")}
                shortKey={ShortKey.DIVIDER}
                active={score.data.dividers.findIndex(d => [DividerType.BAR, DividerType.SEPARATOR].includes(d.type)
                    && d.position === (activePosition + 1)) >= 0}
                onClick={toggleDivider}
            >
                <RxDividerVertical size={Size.icon.XS}/>
            </ControlButton>
            <ControlButton
                tooltip={t(`tooltip.${isShiftKeyActive ? "shiftVoicesLeft" : (isCtrlKeyActive ? "shiftLyricsLeft" : "shiftLeft")}`)}
                shortKey={ShortKey.SHIFT_LEFT}
                onClick={handleShiftLeft}
            >
                {ShiftLeftIcons.get(isShiftKeyActive
                    ? ShiftMode.VOICES
                    : (isCtrlKeyActive ? ShiftMode.LYRICS : ShiftMode.NOTES))}
            </ControlButton>
            <ControlButton
                tooltip={t(`tooltip.${isShiftKeyActive ? "shiftVoicesRight" : (isCtrlKeyActive ? "shiftLyricsRight" : "shiftLyricsRight")}`)}
                shortKey={ShortKey.SHIFT_RIGHT}
                onClick={handleShiftRight}
            >
                {ShiftRightIcons.get(isShiftKeyActive
                    ? ShiftMode.VOICES
                    : (isCtrlKeyActive ? ShiftMode.LYRICS : ShiftMode.NOTES))}
            </ControlButton>
            <ControlButton
                tooltip={t("tooltip.removeNote")}
                shortKey={ShortKey.REMOVE_NOTE}
                onClick={() => removeNote(activePosition, true)}
            >
                <FaDeleteLeft size={Size.icon.XS}/>
            </ControlButton>
        </Group>
    )
};

export default LayoutControls;
