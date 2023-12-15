import React from 'react';
import {useScoreContext} from "../../context/ScoreContext";
import Dialog from "./Dialog";
import {DialogType, useDialogContext} from "../../context/DialogContext";
import {useTranslation} from "react-i18next";

const ResetScoreDialog: React.FC = () => {

    const [t] = useTranslation();
    const context = useScoreContext();
    const {close} = useDialogContext();

    const confirm = () => {
        context.clear();
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
            <p>{t("dialog.resetScore.description")}</p>
        </Dialog>
    )
};

export default ResetScoreDialog;
