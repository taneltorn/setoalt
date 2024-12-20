import React from 'react';
import Dialog from "../../../../components/dialog/Dialog.tsx";
import {useDialogContext} from "../../../../hooks/useDialogContext.tsx";
import {Trans, useTranslation} from "react-i18next";
import {Text} from "@mantine/core";
import useNotificationService from "../../../../hooks/useNotificationService.tsx";
import {DialogType} from "../../../../utils/enums.ts";

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
                close();
                context.onRemove && context.onRemove();
            });
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
