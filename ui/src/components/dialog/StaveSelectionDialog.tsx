import React, {useEffect, useState} from 'react';
import {useScoreContext} from "../../context/ScoreContext";
import Dialog from "./Dialog";
import {DialogType, useDialogContext} from "../../context/DialogContext";
import {useTranslation} from "react-i18next";
import StaveSelection from "../editor/StaveSelection";
import {Stave} from "../../models/Stave";

const StaveSelectionDialog: React.FC = () => {

    const [t] = useTranslation();
    const context = useScoreContext();
    const {close} = useDialogContext();
    const [stave, setStave] = useState<Stave>(context.score.data.stave);

    const handleSave = () => {
        context.score.data.stave = stave;
        context.refresh();
        close();
    }

    const handleClose = () => {
        setStave(context.score.data.stave);
        close();
    }

    useEffect(() => {
        setStave(context.score.data.stave);
    }, [context.score.data.stave]);

    return (
        <Dialog
            type={DialogType.STAVE_SELECTION}
            size={"lg"}
            title={t("dialog.staveSelection.title")}
            primaryButtonLabel={t("button.save")}
            secondaryButtonLabel={t("button.cancel")}
            onPrimaryButtonClick={handleSave}
            onSecondaryButtonClick={handleClose}
            onClose={handleClose}
        >
            <StaveSelection activeStave={stave} onSelect={setStave}/>
        </Dialog>
    )
};

export default StaveSelectionDialog;
