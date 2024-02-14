import React from 'react';
import Dialog from "./Dialog";
import {DialogType, useDialogContext} from "../../context/DialogContext";
import {useTranslation} from "react-i18next";
import {Text} from "@mantine/core";
import useScoreService from '../../services/ScoreService.tsx';
import {DisplayError, DisplaySuccess} from "../../utils/helpers.tsx";

const RemoveScoreDialog: React.FC = () => {

    const [t] = useTranslation();
    const {close, context} = useDialogContext();
    const scoreService = useScoreService();

    const confirm = async () => {
        scoreService.removeScore(context.id)
            .then(() => {
                DisplaySuccess(t("toast.success.title"), t("toast.success.removeScore"))
                close();
                context.onRemove && context.onRemove();
            })
            .catch(() => DisplayError(t("toast.error.title"), t("toast.error.removeScore")));
    }

    return (
        <Dialog
            type={DialogType.REMOVE_SCORE}
            size={"sm"}
            title={t("dialog.removeScore.title")}
            primaryButtonLabel={t("button.confirm")}
            secondaryButtonLabel={t("button.cancel")}
            onPrimaryButtonClick={confirm}
            onSecondaryButtonClick={close}
            onClose={close}
        >
            <Text>{t("dialog.removeScore.description", {name: context.name})}</Text>
        </Dialog>
    )
};

export default RemoveScoreDialog;
