import React from 'react';
import {useScoreContext} from "../../../../../context/ScoreContext.tsx";
import Dialog from "../../../../../components/dialog/Dialog.tsx";
import {DialogType, useDialogContext} from "../../../../../context/DialogContext.tsx";
import {useTranslation} from "react-i18next";
import {Text} from "@mantine/core";

const ResetScoreDialog: React.FC = () => {

    const [t] = useTranslation();
    const context = useScoreContext();
    const {close} = useDialogContext();

    const confirm = () => {
        context.reset();
        close();
    }

    return (
        <Dialog
            type={DialogType.CLEAR_SCORE}
            title={t("dialog.resetScore.title")}
            primaryButtonLabel={t("button.confirm")}
            secondaryButtonLabel={t("button.cancel")}
            onPrimaryButtonClick={confirm}
            onSecondaryButtonClick={close}
            onClose={close}
        >
            <Text size={"xl"} mb={"xl"}>
                {t("dialog.resetScore.description")}
            </Text>
        </Dialog>
    )
};

export default ResetScoreDialog;
