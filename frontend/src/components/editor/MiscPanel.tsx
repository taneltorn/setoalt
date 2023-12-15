import React from 'react';
import {useTranslation} from "react-i18next";
import {FaRegTrashAlt} from "react-icons/fa";
import {DialogType, useDialogContext} from "../../context/DialogContext";
import ControlButton from "../common/ControlButton.tsx";
import {Group} from "@mantine/core";

const MiscPanel: React.FC = () => {

    const [t] = useTranslation();
    const {open} = useDialogContext();

    return (
        <Group gap={4} ml={"md"}>
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

export default MiscPanel;
