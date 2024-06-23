import React from "react";
import Page from "../../../Page.tsx";
import {Badge, Group, Text, useMantineTheme} from "@mantine/core";
import {Score} from "../../../model/Score.ts";
import Header from "../../../components/controls/Header.tsx";
import {useTranslation} from "react-i18next";
import Description from "../../../components/controls/Description.tsx";
import ScoreControls from "./editor/controls/ScoreControls.tsx";
import {useAuth} from "../../../context/AuthContext.tsx";
import {useNavigate} from "react-router-dom";
import VoiceFilter from "./playback/controls/VoiceFilter.tsx";
import Stave from "./stave/Stave.tsx";
import ScorePlaybackPanel from "./playback/ScorePlaybackPanel.tsx";
import BackLink from "../../../components/controls/BackLink.tsx";
import {useAudioContext} from "../../../context/AudioContext.tsx";

interface Properties {
    score: Score;
}

const ScoreDetails: React.FC<Properties> = ({score}) => {

    const [t] = useTranslation();
    const theme = useMantineTheme();
    const {stopPlayback} = useAudioContext();
    const auth = useAuth();
    const navigate = useNavigate();

    const handleClick = () => {
        stopPlayback();
        navigate("edit");
    }

    return (
        <Page title={score.name}>
            <Header
                leftSection={<BackLink to={"/scores"}/>}
                rightSection={<>
                    {auth.currentUser?.isAuthorized &&
                        <ScoreControls
                            primaryButtonLabel={t("button.edit")}
                            primaryButtonVariant={"outline"}
                            onPrimaryButtonClick={handleClick}
                            hideSecondaryButton
                        />}
                </>
                }>
                <Group>
                    {score.name}
                    <Badge py={"sm"}
                           bg={score?.visibility === "PUBLIC" ? theme.primaryColor : theme.colors.gray[5]}>
                        {t(`visibility.${score?.visibility?.toLowerCase()}`)}
                    </Badge>
                </Group>
            </Header>
            <Description>{score.description}</Description>

            <ScorePlaybackPanel/>

            <VoiceFilter/>
            <Stave score={score}/>

            {score.text && <>
                <Text fw={600}>Laulusõnad</Text>
                <pre style={{whiteSpace: "pre-wrap"}}>{score?.text}</pre>
            </>}
        </Page>
    );
}

export default ScoreDetails;
