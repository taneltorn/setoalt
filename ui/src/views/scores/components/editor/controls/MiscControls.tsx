import React from 'react';
import {useTranslation} from "react-i18next";
import {FaRegTrashAlt} from "react-icons/fa";
import {DialogType, useDialogContext} from "../../../../../context/DialogContext.tsx";
import ControlButton from "../../../../../components/controls/ControlButton.tsx";
import {Group} from "@mantine/core";
import {useScoreContext} from "../../../../../context/ScoreContext.tsx";
import {useHistoryContext} from "../../../../../context/HistoryContext.tsx";
import {IoIosUndo} from "react-icons/io";

const MiscControls: React.FC = () => {

    const [t] = useTranslation();
    const {open} = useDialogContext();
    const context = useScoreContext();
    const {undo} = useHistoryContext();

    return (
        <Group gap={4}>
            <ControlButton
                className={"ms-4 me-1"}
                tooltip={t("tooltip.resetScore")}
                active={false}
                label={<FaRegTrashAlt/>}
                onClick={() => open(DialogType.CLEAR_SCORE)}
            />

            <ControlButton
                className={"ms-4 me-1"}
                tooltip={t("tooltip.resetScore")}
                active={false}
                label={<IoIosUndo/>}
                onClick={() => undo(context)}
            />
        </Group>
    )
};

export default MiscControls;
