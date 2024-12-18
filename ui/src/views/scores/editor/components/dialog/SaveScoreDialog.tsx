import React from 'react';
import Dialog from "../../../../../components/dialog/Dialog.tsx";
import { useDialogContext} from "../../../../../hooks/useDialogContext.tsx";
import {useTranslation} from "react-i18next";
import {useScoreContext} from '../../../../../hooks/useScoreContext.tsx';
import useScoreService from '../../../../../hooks/useScoreService.tsx';
import {FormProvider, useForm} from 'react-hook-form';
import {Playback} from "../../../../../utils/constants.ts";
import {Score} from "../../../../../model/Score.ts";
import {useNavigate} from "react-router-dom";
import ScoreForm from "../form/ScoreForm.tsx";
import {DialogType, Role} from "../../../../../utils/enums.ts";
import {useAuth} from "../../../../../hooks/useAuth.tsx";

const SaveScoreDialog: React.FC = () => {

    const [t] = useTranslation();
    const context = useScoreContext();
    const scoreService = useScoreService();

    const navigate = useNavigate();
    const {close} = useDialogContext();
    const auth = useAuth();

    const DEFAULT_VALUES = {
        name: "",
        description: "",
        defaultTempo: Playback.DEFAULT_TEMPO,
        defaultTransposition: Playback.DEFAULT_TRANSPOSITION_ON_SAVE,
        visibility: [Role.ADMIN, Role.EDITOR].includes(auth.currentUser?.role as Role) ? "PUBLIC" : "PRIVATE",
    }
    const methods = useForm<Score>({defaultValues: DEFAULT_VALUES});

    
    const onSubmit = async (values: Score) => {
        const score = {...values, data: context.score.data};
        score.data.voices.forEach(v => v.hidden = false);

        const saveScore = () => score.id 
            ? scoreService.updateScore(score.id, score)
            : scoreService.createScore(score);
        saveScore()
            .then((r) => {
                close();
                navigate(r.id ? `/scores/${r.id}` : "/scores");
            });
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
