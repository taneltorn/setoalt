import React from "react";
import Page from "../../../Page.tsx";
import {Badge, Grid, Text, useMantineTheme} from "@mantine/core";
import {Score} from "../../../models/Score.ts";
import Header from "../../../components/controls/Header.tsx";
import {useTranslation} from "react-i18next";
import Description from "../../../components/controls/Description.tsx";
import ScoreControls from "./editor/controls/ScoreControls.tsx";
import {useAuth} from "../../../context/AuthContext.tsx";
import {useNavigate} from "react-router-dom";
import VoiceFilter from "./playback/controls/VoiceFilter.tsx";
import Stave from "./stave/Stave.tsx";
import ScorePlaybackPanel from "./playback/ScorePlaybackPanel.tsx";
import ControlPanel from "../../../components/controls/ControlPanel.tsx";
import BackLink from "../../../components/controls/BackLink.tsx";

interface Properties {
    score: Score;
}

const ScoreDetails: React.FC<Properties> = ({score}) => {

    const [t] = useTranslation();
    const theme = useMantineTheme();
    const auth = useAuth();
    const navigate = useNavigate();

    return (
        <Page title={score.name}>
            <Header
                text={score.name}
                leftSection={<BackLink/>}
                rightSection={
                    <Badge bg={score?.visibility === "PUBLIC" ? theme.primaryColor : theme.colors.gray[5]}>
                        {t(`visibility.${score?.visibility?.toLowerCase()}`)}
                    </Badge>
                }/>
            <Description text={score.description}/>

            <ControlPanel
                leftSection={<ScorePlaybackPanel/>}
                rightSection={
                    auth.currentUser?.isAuthorized &&
                    <ScoreControls
                        primaryButtonLabel={t("button.edit")}
                        primaryButtonVariant={"outline"}
                        onPrimaryButtonClick={() => navigate("edit")}
                        hideSecondaryButton
                    />}
            />

            <VoiceFilter/>
            <Stave score={score}/>

            <Grid>
                <Grid.Col span={8}>
                    <Text fz={18}>
                        <pre>
                            {score?.text}
                        </pre>
                    </Text>
                </Grid.Col>
            </Grid>
        </Page>
    );
}

export default ScoreDetails;
