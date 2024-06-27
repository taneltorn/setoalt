import React from "react";
import {Grid, Group, Tabs, Text} from "@mantine/core";
import {useTranslation} from "react-i18next";
import Page from "../../../Page.tsx";
import ScoreEditorPanel from "./editor/ScoreEditorPanel.tsx";
import VoiceControls from "./editor/controls/VoiceControls.tsx";
import {Score} from "../../../model/Score.ts";
import {FormProvider, useForm} from "react-hook-form";
import ScoreForm from "./editor/form/ScoreForm.tsx";
import {DisplayError, DisplaySuccess} from "../../../utils/helpers.tsx";
import {useScoreContext} from "../../../context/ScoreContext.tsx";
import useScoreService from "../../../services/ScoreService.tsx";
import {useNavigate} from "react-router-dom";
import ScoreControls from "./editor/controls/ScoreControls.tsx";
import Header from "../../../components/controls/Header.tsx";
import ScorePlaybackPanel from "./playback/ScorePlaybackPanel.tsx";
import Stave from "./stave/Stave.tsx";
import BackLink from "../../../components/controls/BackLink.tsx";
import {FaClipboardList} from "react-icons/fa";
import StaveParameters from "./editor/form/StaveParameters.tsx";
import {useAudioContext} from "../../../context/AudioContext.tsx";
import ExportControls from "./export/ExportControls.tsx";
import {Size} from "../../../utils/constants.ts";
import {BsMusicNoteList} from "react-icons/bs";
import {PiSliders} from "react-icons/pi";

interface Properties {
    score: Score;
}

const ScoreEditor: React.FC<Properties> = ({score}) => {

    const {t} = useTranslation();
    const context = useScoreContext();
    const {stopPlayback} = useAudioContext();
    const scoreService = useScoreService();
    const navigate = useNavigate();

    const methods = useForm<Score>({defaultValues: {...score}});

    const onSubmit = async (values: Score) => {
        stopPlayback();
        const score = {...values, data: {...context.score.data, stave: values.data.stave}};
        score.data.voices.forEach(v => v.hidden = false);
        const saveScore = () => score.id ? scoreService.updateScore(score.id, score) : scoreService.createScore(score);
        saveScore()
            .then(() => {
                DisplaySuccess(t("toast.success.saveScore"));
                navigate(`/scores/${score.id}`);
            })
            .catch(() => DisplayError(t("toast.error.saveScore")));
    }

    const handleCancel = () => {
        stopPlayback();
        navigate(`/scores/${score?.id}`);
    }

    return (
        <Page title={score.name}>
            <Header
                leftSection={<BackLink to={`/scores/${score.id}`}/>}
                rightSection={
                    <ScoreControls
                        onPrimaryButtonClick={methods.handleSubmit(onSubmit)}
                        onSecondaryButtonClick={handleCancel}
                    />
                }
            >{score.name}</Header>

            <Tabs defaultValue="editor">
                <Tabs.List>
                    <Tabs.Tab value="editor" leftSection={<BsMusicNoteList size={Size.icon.MD}/>}>
                        <Text size={"lg"}>
                            {t("view.editor.tab.editor")}
                        </Text>
                    </Tabs.Tab>

                    <Tabs.Tab value="data" leftSection={<FaClipboardList size={Size.icon.MD}/>}>
                        <Text size={"lg"}>
                            {t("view.editor.tab.data")}
                        </Text>
                    </Tabs.Tab>

                    <Tabs.Tab value="stave" leftSection={<PiSliders size={Size.icon.MD}/>}>
                        <Text size={"lg"}>
                            {t("view.editor.tab.stave")}
                        </Text>
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="editor" pt={"xl"}>
                    <Group justify={"space-between"}>
                        <ScorePlaybackPanel/>
                        <ExportControls hideEmbeddingExport/>
                    </Group>
                    <VoiceControls/>
                    <ScoreEditorPanel/>
                    <Stave score={score} isEditMode/>
                </Tabs.Panel>

                <Tabs.Panel value={"data"} pt={"xl"}>
                    <FormProvider {...methods}>
                        <Grid>
                            <Grid.Col span={8}>
                                <ScoreForm onSubmit={onSubmit}/>
                            </Grid.Col>
                        </Grid>
                    </FormProvider>
                </Tabs.Panel>

                <Tabs.Panel value={"stave"} pt={"xl"}>
                    <FormProvider {...methods}>
                        <Grid>
                            <Grid.Col span={{xs: 10, lg: 6}}>
                                <StaveParameters/>
                            </Grid.Col>
                        </Grid>
                    </FormProvider>
                </Tabs.Panel>
            </Tabs>
        </Page>
    );
}

export default ScoreEditor;
