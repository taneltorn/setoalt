import React from 'react';
import Dialog from "../../../../components/dialog/Dialog.tsx";
import {useDialogContext} from "../../../../hooks/useDialogContext.tsx";
import {Trans, useTranslation} from "react-i18next";
import {Text} from "@mantine/core";
import {DisplayError, DisplaySuccess} from "../../../../utils/helpers.tsx";
import useUserService from "../../../../hooks/useUserService.tsx";
import {DialogType} from "../../../../utils/enums.ts";

const RemoveUserDialog: React.FC = () => {

    const [t] = useTranslation();
    const {close, context} = useDialogContext();
    const userService = useUserService();

    const confirm = async () => {
        if (!context.user?.id) {
            return;
        }
        userService.removeUser(context.user.id)
            .then(() => {
                DisplaySuccess(t("toast.success.removeUser"))
                close();
                context.onRemove && context.onRemove();
            })
            .catch(() => DisplayError(t("toast.error.removeUser")));
    }

    return (
        <Dialog
            type={DialogType.REMOVE_USER}
            size={"sm"}
            title={t("dialog.removeUser.title")}
            primaryButtonLabel={t("button.confirm")}
            secondaryButtonLabel={t("button.cancel")}
            onPrimaryButtonClick={confirm}
            onSecondaryButtonClick={close}
            onClose={close}
        >
            <Text size={"xl"}>
                <Trans
                    i18nKey="dialog.removeUser.description"
                    values={{username: context.user?.username}}
                />
            </Text>
        </Dialog>
    )
};

export default RemoveUserDialog;
