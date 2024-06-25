import React from 'react';
import Dialog from "../../../../../components/dialog/Dialog.tsx";
import {DialogType, useDialogContext} from "../../../../../context/DialogContext.tsx";
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
            <Text size={"xl"} mb={"xl"}>
                {t("dialog.removeVoice.description", {name: context.name})}
            </Text>
        </Dialog>
    )
};

export default RemoveVoiceDialog;
