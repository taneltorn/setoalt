import React from 'react';
import Dialog from "../../../../../components/dialog/Dialog.tsx";
import {DialogType, useDialogContext} from "../../../../../context/DialogContext.tsx";
import {useTranslation} from "react-i18next";
import {useScoreContext} from '../../../../../context/ScoreContext.tsx';
import useScoreService from '../../../../../services/ScoreService.tsx';
import {FormProvider, useForm} from 'react-hook-form';
import {Playback} from "../../../../../utils/constants.ts";
import {Score} from "../../../../../model/Score.ts";
import {DisplayError, DisplaySuccess} from "../../../../../utils/helpers.tsx";
import {useNavigate} from "react-router-dom";
import ScoreForm from "../form/ScoreForm.tsx";

const DEFAULT_VALUES = {
    name: "",
    description: "",
    defaultTempo: Playback.DEFAULT_TEMPO,
    defaultTransposition: Playback.DEFAULT_TRANSPOSITION,
    visibility: "PUBLIC",
}

const SaveScoreDialog: React.FC = () => {

    const [t] = useTranslation();
    const context = useScoreContext();
    const {close} = useDialogContext();
    const scoreService = useScoreService();
    const navigate = useNavigate();

    const methods = useForm<Score>({defaultValues: DEFAULT_VALUES});

    const onSubmit = async (values: Score) => {
        const score = {...values, data: context.score.data};
        score.data.voices.forEach(v => v.hidden = false);

        const saveScore = () => score.id ? scoreService.updateScore(score.id, score) : scoreService.createScore(score);
        saveScore()
            .then(() => {
                DisplaySuccess(t("toast.success.title"), t("toast.success.saveScore"))
                close();
                navigate("/scores");
            })
            .catch(() => DisplayError(t("toast.error.title"), t("toast.error.saveScore")));
    }

    return (
        <Dialog
            type={DialogType.SAVE_SCORE}
            title={t("dialog.saveScore.title")}
            onPrimaryButtonClick={methods.handleSubmit(onSubmit)}
            onSecondaryButtonClick={close}
            size={"lg"}
            onClose={close}
        >
            <FormProvider {...methods}>
                <ScoreForm onSubmit={onSubmit}/>
            </FormProvider>
        </Dialog>
    )
};

export default SaveScoreDialog;
