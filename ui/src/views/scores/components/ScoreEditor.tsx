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
import {useScoreContext} from "../../../hooks/useScoreContext.tsx";
import useScoreService from "../../../hooks/useScoreService.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import ScoreControls from "./editor/controls/ScoreControls.tsx";
import Header from "../../../components/controls/Header.tsx";
import ScorePlaybackPanel from "./playback/ScorePlaybackPanel.tsx";
import Stave from "./stave/Stave.tsx";
import BackLink from "../../../components/controls/BackLink.tsx";
import {FaClipboardList} from "react-icons/fa";
import StaveParameters from "./editor/form/StaveParameters.tsx";
import {useAudioContext} from "../../../hooks/useAudioContext.tsx";
import {Size} from "../../../utils/constants.ts";
import {BsMusicNoteList} from "react-icons/bs";
import {PiSliders} from "react-icons/pi";
import ScoreSettings, {Setting} from "./ScoreSettings.tsx";

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
        saveScore()
            .then(() => {
                DisplaySuccess(t("toast.success.saveScore"));
                navigate(`/scores/${score.id}`);
            })
            .catch(() => DisplayError(t("toast.error.saveScore")));
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
                        <ScorePlaybackPanel/>
                        <ScoreSettings settings={[Setting.CHANGE_MODE, Setting.EMBED_CODE, Setting.EXPORT_PNG]}/>
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
