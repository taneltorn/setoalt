import React from "react";
import {Grid} from "@mantine/core";
import {useTranslation} from "react-i18next";
import Page from "../../../Page.tsx";
import ScoreEditorPanel from "./editor/ScoreEditorPanel.tsx";
import VoiceControls from "./editor/controls/VoiceControls.tsx";
import {Score} from "../../../models/Score.ts";
import {FormProvider, useForm} from "react-hook-form";
import ScoreForm from "./editor/form/ScoreForm.tsx";
import {DisplayError, DisplaySuccess} from "../../../utils/helpers.tsx";
import {useScoreContext} from "../../../context/ScoreContext.tsx";
import useScoreService from "../../../services/ScoreService.tsx";
import {useNavigate} from "react-router-dom";
import ScoreControls from "./editor/controls/ScoreControls.tsx";
import Header from "../../../components/controls/Header.tsx";
import Description from "../../../components/controls/Description.tsx";
import ScorePlaybackPanel from "./playback/ScorePlaybackPanel.tsx";
import Stave from "./stave/Stave.tsx";
import BackLink from "../../../components/controls/BackLink.tsx";
import ControlPanel from "../../../components/controls/ControlPanel.tsx";

interface Properties {
    score: Score;
}

const ScoreEditor: React.FC<Properties> = ({score}) => {

    const {t} = useTranslation();
    const context = useScoreContext();
    const scoreService = useScoreService();
    const navigate = useNavigate();

    const methods = useForm<Score>({defaultValues: {...score}});

    const onSubmit = async (values: Score) => {
        const score = {...values, data: context.score.data};
        score.data.voices.forEach(v => v.hidden = false);
        const saveScore = () => score.id ? scoreService.updateScore(score.id, score) : scoreService.createScore(score);
        saveScore()
            .then(() => {
                DisplaySuccess(t("toast.success.title"), t("toast.success.saveScore"));
                navigate(`/scores/${score.id}`);
            })
            .catch(() => DisplayError(t("toast.error.title"), t("toast.error.saveScore")));
    }

    return (
        <Page title={score.name}>
            <Header text={score.name} leftSection={<BackLink to={`/scores/${score.id}`}/>}/>
            <Description text={score.description}/>

            <ControlPanel
                leftSection={<ScorePlaybackPanel/>}
                rightSection={
                    <ScoreControls
                        onPrimaryButtonClick={methods.handleSubmit(onSubmit)}
                        onSecondaryButtonClick={() => navigate(`/scores/${score?.id}`)}
                    />}
            />

            <VoiceControls/>
            <ScoreEditorPanel/>

            <Stave score={score} isEditMode/>

            {score &&
                <FormProvider {...methods}>
                    <Grid>
                        <Grid.Col span={8}>
                            <ScoreForm onSubmit={onSubmit}/>
                        </Grid.Col>
                    </Grid>
                </FormProvider>}
        </Page>
    );
}

export default ScoreEditor;
