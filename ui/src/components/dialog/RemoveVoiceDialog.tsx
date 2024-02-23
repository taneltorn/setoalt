import React from 'react';
import Dialog from "./Dialog";
import {DialogType, useDialogContext} from "../../context/DialogContext";
import {useTranslation} from "react-i18next";
import {Text} from "@mantine/core";

const RemoveVoiceDialog: React.FC = () => {

    const [t] = useTranslation();
    const {close, context} = useDialogContext();

    return (
        <Dialog
            type={DialogType.REMOVE_VOICE}
            size={"sm"}
            title={t("dialog.removeVoice.title")}
            primaryButtonLabel={t("button.confirm")}
            secondaryButtonLabel={t("button.cancel")}
            onPrimaryButtonClick={context.onRemove}
            onSecondaryButtonClick={close}
            onClose={close}
        >
            <Text>{t("dialog.removeVoice.description", {name: context.name})}</Text>
        </Dialog>
    )
};

export default RemoveVoiceDialog;
