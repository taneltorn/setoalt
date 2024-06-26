import React from 'react';
import Dialog from "../../../components/dialog/Dialog.tsx";
import {DialogType, useDialogContext} from "../../../context/DialogContext.tsx";
import {useTranslation} from "react-i18next";
import {Text} from "@mantine/core";
import {DisplayError, DisplaySuccess} from "../../../utils/helpers.tsx";
import useUserService from "../../../services/UserService.tsx";

const RemoveUserDialog: React.FC = () => {

    const [t] = useTranslation();
    const {close, context} = useDialogContext();
    const userService = useUserService();

    const confirm = async () => {
        userService.removeUser(context.id)
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
            <Text size={"xl"} mb={"xl"}>
                {t("dialog.removeUser.description", {username: context.username})}
            </Text>
        </Dialog>
    )
};

export default RemoveUserDialog;
