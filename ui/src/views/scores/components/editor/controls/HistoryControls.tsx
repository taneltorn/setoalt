import React from 'react';
import {useTranslation} from "react-i18next";
import {FaRegTrashAlt} from "react-icons/fa";
import {DialogType, useDialogContext} from "../../../../../context/DialogContext.tsx";
import ControlButton from "../../../../../components/controls/ControlButton.tsx";
import {Group} from "@mantine/core";
import {useScoreContext} from "../../../../../context/ScoreContext.tsx";
import {useHistory} from "../../../../../context/HistoryContext.tsx";
import {IoIosRedo, IoIosUndo} from "react-icons/io";
import {ShortKey} from "../../../../../utils/keymap.ts";

const HistoryControls: React.FC = () => {

    const [t] = useTranslation();
    const {open} = useDialogContext();
    const context = useScoreContext();
    const {undo, redo, undoStates, recoverStates} = useHistory();

    return (
        <Group gap={4}>
            <ControlButton
                className={"ms-4 me-1"}
                tooltip={t("tooltip.undo")}
                shortKey={`Ctrl + ${ShortKey.UNDO}`}
                active={false}
                disabled={!undoStates.length}
                label={<IoIosUndo/>}
                onClick={() => undo(context)}
            />

            <ControlButton
                className={"ms-4 me-1"}
                tooltip={t("tooltip.redo")}
                shortKey={`Ctrl + ${ShortKey.REDO}`}
                active={false}
                disabled={!recoverStates.length}
                label={<IoIosRedo/>}
                onClick={() => redo(context)}
            />

            <ControlButton
                className={"ms-4 me-1"}
                tooltip={t("tooltip.resetScore")}
                active={false}
                label={<FaRegTrashAlt/>}
                onClick={() => open(DialogType.CLEAR_SCORE)}
            />
        </Group>
    )
};

export default HistoryControls;
