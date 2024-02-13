import React from 'react';
import Dialog from "./Dialog";
import {DialogType, useDialogContext} from "../../context/DialogContext";
import {useTranslation} from "react-i18next";
import {Box} from "@mantine/core";
import EditScoreForm from "../form/EditScoreForm.tsx";

const SaveScoreDialog: React.FC = () => {

    const [t] = useTranslation();
    const {close} = useDialogContext();

    return (
        <Dialog
            type={DialogType.SAVE_SCORE}
            title={t("dialog.saveScore.title")}
            hidePrimaryButton
            hideSecondaryButton
            onClose={close}
        >
            <Box style={{width: 700}}>
               <EditScoreForm onSubmit={close}/>
            </Box>
        </Dialog>
    )
};

export default SaveScoreDialog;
