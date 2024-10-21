import React from 'react';
import Dialog from "../../../../../components/dialog/Dialog.tsx";
import { useDialogContext} from "../../../../../hooks/useDialogContext.tsx";
import {useTranslation} from "react-i18next";
import {useScoreContext} from '../../../../../hooks/useScoreContext.tsx';
import useScoreService from '../../../../../hooks/useScoreService.tsx';
import {FormProvider, useForm} from 'react-hook-form';
import {Playback} from "../../../../../utils/constants.ts";
import {Score} from "../../../../../model/Score.ts";
import {DisplayError, DisplaySuccess} from "../../../../../utils/helpers.tsx";
import {useNavigate} from "react-router-dom";
import ScoreForm from "../form/ScoreForm.tsx";
import {DialogType} from "../../../../../utils/enums.ts";

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
    const scoreService = useScoreService();

    const navigate = useNavigate();
    const {close} = useDialogContext();

    const methods = useForm<Score>({defaultValues: DEFAULT_VALUES});

    const onSubmit = async (values: Score) => {
        const score = {...values, data: context.score.data};
        score.data.voices.forEach(v => v.hidden = false);

        const saveScore = () => score.id ? scoreService.updateScore(score.id, score) : scoreService.createScore(score);
        saveScore()
            .then((r) => {
                DisplaySuccess(t("toast.success.saveScore"))
                close();
                navigate(r.id ? `/scores/${r.id}` : "/scores");
            })
            .catch(() => DisplayError(t("toast.error.saveScore")));
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
