import React from "react";
import {Grid, Group, Tabs, Text} from "@mantine/core";
import {useTranslation} from "react-i18next";
import Page from "../../../Page.tsx";
import ScoreEditorPanel from "./components/ScoreEditorPanel.tsx";
import VoiceControls from "./components/controls/VoiceControls.tsx";
import {Score} from "../../../model/Score.ts";
import {FormProvider, useForm} from "react-hook-form";
import ScoreForm from "./components/form/ScoreForm.tsx";
import {useScoreContext} from "../../../hooks/useScoreContext.tsx";
import useScoreService from "../../../hooks/useScoreService.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import ScoreControls from "./components/controls/ScoreControls.tsx";
import Header from "../../../components/controls/Header.tsx";
import Stave from "../details/components/stave/Stave.tsx";
import BackLink from "../../../components/controls/BackLink.tsx";
import {FaClipboardList} from "react-icons/fa";
import StaveParameters from "./components/form/StaveParameters.tsx";
import {useAudioContext} from "../../../hooks/useAudioContext.tsx";
import {Size} from "../../../utils/constants.ts";
import {BsMusicNoteList} from "react-icons/bs";
import {PiSliders} from "react-icons/pi";
import ScoreSettings from "../details/components/ScoreSettings.tsx";
import {AllScoreSettings} from "../../../utils/dictionaries.ts";
import PlaybackControls from "../details/components/playback/PlaybackControls.tsx";

interface Properties {
    score: Score;
}

const ScoreEditor: React.FC<Properties> = ({score}) => {

    const {t} = useTranslation();
    const context = useScoreContext();
    const {stopPlayback} = useAudioContext();
    const scoreService = useScoreService();
    const navigate = useNavigate();
    const location = useLocation();

    const methods = useForm<Score>({defaultValues: {...score}});

    const onSubmit = async (values: Score) => {
        stopPlayback();

        const score = {...values, data: {...context.score.data, stave: values.data.stave}};
        score.data.voices.forEach(v => v.hidden = false);

        const saveScore = () => score.id ? scoreService.updateScore(score.id, score) : scoreService.createScore(score);
        saveScore().then(() => navigate(`/scores/${score.id}`));
    }

    const handleCancel = () => {
        stopPlayback();
        navigate(`/scores/${score?.id}`, {state: location.state});
    }

    return (
        <Page title={score.name}>
            <Header
                leftSection={<BackLink to={location?.state?.to || `/scores/${score.id}`} state={location.state}/>}
                rightSection={
                    <ScoreControls
                        onPrimaryButtonClick={methods.handleSubmit(onSubmit)}
                        onSecondaryButtonClick={handleCancel}
                    />
                }
            >{score.name}</Header>

            <Tabs defaultValue="editor" radius={"xs"}>
                <Tabs.List>
                    <Tabs.Tab value="editor" leftSection={<BsMusicNoteList size={Size.icon.MD}/>}>
                        <Text size={"lg"}>
                            {t("view.editor.form.editor")}
                        </Text>
                    </Tabs.Tab>

                    <Tabs.Tab value="data" leftSection={<FaClipboardList size={Size.icon.MD}/>}>
                        <Text size={"lg"}>
                            {t("view.editor.form.data")}
                        </Text>
                    </Tabs.Tab>

                    <Tabs.Tab value="stave" leftSection={<PiSliders size={Size.icon.MD}/>}>
                        <Text size={"lg"}>
                            {t("view.editor.form.stave")}
                        </Text>
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="editor" pt={"xl"}>
                    <Group justify={"space-between"}>
                        <PlaybackControls/>
                        <ScoreSettings settings={AllScoreSettings}/>
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
