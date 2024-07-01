import React from 'react';
import Dialog from "../../../components/dialog/Dialog.tsx";
import {DialogType, useDialogContext} from "../../../context/DialogContext.tsx";
import {Trans, useTranslation} from "react-i18next";
import {Text} from "@mantine/core";
import {DisplayError, DisplaySuccess} from "../../../utils/helpers.tsx";
import useNotificationService from "../../../hooks/useNotificationService.tsx";

const RemoveNotificationDialog: React.FC = () => {

    const [t] = useTranslation();
    const {close, context} = useDialogContext();
    const notificationService = useNotificationService();

    const confirm = async () => {
        if (!context.notification?.id) {
            return;
        }
        notificationService.removeNotification(context.notification.id)
            .then(() => {
                DisplaySuccess(t("toast.success.removeNotification"))
                close();
                context.onRemove && context.onRemove();
            })
            .catch(() => DisplayError(t("toast.error.removeNotification")));
    }

    return (
        <Dialog
            type={DialogType.REMOVE_NOTIFICATION}
            size={"sm"}
            title={t("dialog.removeNotification.title")}
            primaryButtonLabel={t("button.confirm")}
            secondaryButtonLabel={t("button.cancel")}
            onPrimaryButtonClick={confirm}
            onSecondaryButtonClick={close}
            onClose={close}
        >
            <Text size={"xl"}>
                <Trans
                    i18nKey="dialog.removeNotification.description"
                    values={{title: context.notification?.title}}
                />
            </Text>
        </Dialog>
    )
};

export default RemoveNotificationDialog;
