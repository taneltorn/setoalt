import React from 'react';
import {useTranslation} from "react-i18next";
import {FaRegTrashAlt} from "react-icons/fa";
import {DialogType, useDialogContext} from "../../../../../context/DialogContext.tsx";
import ControlButton from "../../../../../components/controls/ControlButton.tsx";
import {Group} from "@mantine/core";
import {useScoreContext} from "../../../../../context/ScoreContext.tsx";
import {useHistory} from "../../../../../context/HistoryContext.tsx";
import {IoMdRedo, IoMdUndo} from "react-icons/io";
import {ShortKey} from "../../../../../utils/keymap.ts";
import {Size} from "../../../../../utils/constants.ts";

const HistoryControls: React.FC = () => {

    const [t] = useTranslation();
    const {open} = useDialogContext();
    const context = useScoreContext();
    const {undo, redo, undoStates, recoverStates} = useHistory();

    return (
        <Group gap={2}>
            <ControlButton
                className={"ms-4 me-1"}
                tooltip={t("tooltip.undo")}
                shortKey={`Ctrl + ${ShortKey.UNDO}`}
                active={false}
                disabled={!undoStates.length}
                onClick={() => undo(context)}
            >
                <IoMdUndo size={Size.icon.XS}/>
            </ControlButton>

            <ControlButton
                className={"ms-4 me-1"}
                tooltip={t("tooltip.redo")}
                shortKey={`Ctrl + ${ShortKey.REDO}`}
                active={false}
                disabled={!recoverStates.length}
                onClick={() => redo(context)}
            >
                <IoMdRedo size={Size.icon.XS}/>
            </ControlButton>

            <ControlButton
                className={"ms-4 me-1"}
                tooltip={t("tooltip.resetScore")}
                active={false}
                onClick={() => open(DialogType.CLEAR_SCORE)}
            >
                <FaRegTrashAlt size={Size.icon.XS}/>
            </ControlButton>
        </Group>
    )
};

export default HistoryControls;
