import React from 'react';
import Dialog from "./Dialog";
import {DialogType, useDialogContext} from "../../context/DialogContext";
import {useTranslation} from "react-i18next";
import {Text} from "@mantine/core";
import {DisplayError, DisplaySuccess} from "../../utils/helpers.tsx";
import useUserService from "../../services/UserService.tsx";

const RemoveUserDialog: React.FC = () => {

    const [t] = useTranslation();
    const {close, context} = useDialogContext();
    const userService = useUserService();

    const confirm = async () => {
        userService.removeUser(context.id)
            .then(() => {
                DisplaySuccess(t("toast.success.title"), t("toast.success.removeUser"))
                close();
                context.onRemove && context.onRemove();
            })
            .catch(() => DisplayError(t("toast.error.title"), t("toast.error.removeUser")));
    }

    return (
        <Dialog
            type={DialogType.REMOVE_SCORE}
            size={"sm"}
            title={t("dialog.removeUser.title")}
            primaryButtonLabel={t("button.confirm")}
            secondaryButtonLabel={t("button.cancel")}
            onPrimaryButtonClick={confirm}
            onSecondaryButtonClick={close}
            onClose={close}
        >
            <Text>{t("dialog.removeUser.description", {username: context.username})}</Text>
        </Dialog>
    )
};

export default RemoveUserDialog;
