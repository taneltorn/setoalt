import React from 'react';
import {useScoreContext} from "../../../context/ScoreContext";
import {useTranslation} from "react-i18next";
import {FaBackspace} from "react-icons/fa";
import {ShortKey} from "../../../utils/keymap";
import {TfiShiftLeft, TfiShiftRight} from "react-icons/tfi";
import ControlButton from "../../common/ControlButton.tsx";
import {Group} from "@mantine/core";
import {DividerType} from "../../../models/Divider.ts";

const LayoutControls: React.FC = () => {

    const [t] = useTranslation();
    const context = useScoreContext();


    return (
        <Group gap={4} ml={"md"}>
            <ControlButton
                tooltip={t("tooltip.insertBreak")}
                shortKey={ShortKey.BREAK}
                active={context.score.data.dividers.findIndex(d => d.type === DividerType.BREAK && d.position === context.currentPosition) >= 0}
                label={"↵"}
                onClick={() => context.toggleBreak(context.currentPosition)}
            />
            <ControlButton
                tooltip={t("tooltip.insertDivider")}
                shortKey={ShortKey.DIVIDER}
                active={context.score.data.dividers.findIndex(d => [DividerType.BAR, DividerType.SEPARATOR].includes(d.type)
                    && d.position === (context.currentPosition)) >= 0}
                label={"|"}
                onClick={context.toggleInlineDivider}
            />
            <ControlButton
                tooltip={t("tooltip.shiftLeft")}
                shortKey={ShortKey.SHIFT_LEFT}
                label={<TfiShiftLeft/>}
                onClick={context.shiftLeft}
            />
            <ControlButton
                tooltip={t("tooltip.shiftRight")}
                shortKey={ShortKey.SHIFT_RIGHT}
                label={<TfiShiftRight/>}
                onClick={context.shiftRight}
            />
            <ControlButton
                tooltip={t("tooltip.removeNote")}
                shortKey={ShortKey.REMOVE_NOTE}
                disabled={!context.currentNote}
                label={<FaBackspace size={20}/>}
                onClick={() => context.removeNote()}
            />
        </Group>
    )
};

export default LayoutControls;
