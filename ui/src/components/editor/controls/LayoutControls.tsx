import React from 'react';
import {useScoreContext} from "../../../context/ScoreContext";
import {useTranslation} from "react-i18next";
import {FaBackspace} from "react-icons/fa";
import {ShortKey} from "../../../utils/keymap";
import {TfiShiftLeft, TfiShiftRight} from "react-icons/tfi";
import ControlButton from "../../common/ControlButton.tsx";
import {Group} from "@mantine/core";

const LayoutControls: React.FC = () => {

    const [t] = useTranslation();
    const context = useScoreContext();

    return (
        <Group gap={4} ml={"md"}>
            <ControlButton
                tooltip={t("tooltip.insertBreak")}
                shortKey={ShortKey.BREAK}
                active={context.score.data.breaks.findIndex(d => d === context.currentPosition) >= 0}
                label={"↵"}
                onClick={context.toggleBreak}
            />
            <ControlButton
                tooltip={t("tooltip.insertDivider")}
                shortKey={ShortKey.DIVIDER}
                active={context.score.data.dividers.findIndex(d => d === context.currentPosition) >= 0}
                label={"|"}
                onClick={context.toggleDivider}
            />
            <ControlButton
                tooltip={t("tooltip.shiftLeft",)}
                shortKey={ShortKey.SHIFT_LEFT}
                disabled={!!context.currentNote || context.currentPosition < 0}
                label={<TfiShiftLeft/>}
                onClick={context.shiftLeft}
            />
            <ControlButton
                tooltip={t("tooltip.shiftRight")}
                shortKey={ShortKey.SHIFT_RIGHT}
                disabled={context.currentPosition < 0}
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
