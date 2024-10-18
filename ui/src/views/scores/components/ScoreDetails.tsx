import React, {createRef} from "react";
import Page from "../../../Page.tsx";
import {Badge, Box, Button, Group, useMantineTheme} from "@mantine/core";
import {Score} from "../../../model/Score.ts";
import Header from "../../../components/controls/Header.tsx";
import {useTranslation} from "react-i18next";
import Description from "../../../components/controls/Description.tsx";
import ScoreControls from "./editor/controls/ScoreControls.tsx";
import {useAuth} from "../../../hooks/useAuth.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import VoiceFilter from "./playback/controls/VoiceFilter.tsx";
import Stave from "./stave/Stave.tsx";
import ScorePlaybackPanel from "./playback/ScorePlaybackPanel.tsx";
import BackLink from "../../../components/controls/BackLink.tsx";
import {useAudioContext} from "../../../hooks/useAudioContext.tsx";
import {Size} from "../../../utils/constants.ts";
import ScoreSettings from "./ScoreSettings.tsx";
import {AllScoreSettings} from "../../../utils/dictionaries.ts";
import AudioPlayer from "react-h5-audio-player";
import {PiSpeakerHighFill} from "react-icons/pi";
import {FaPauseCircle} from "react-icons/fa";

interface Properties {
    score: Score;
}

const ScoreDetails: React.FC<Properties> = ({score}) => {

    const playerRef = createRef();

    const [t] = useTranslation();
    const theme = useMantineTheme();

    const {stopPlayback} = useAudioContext();

    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleClick = () => {
        stopPlayback();
        navigate("edit");
    }

    return (
        <Page title={score.name}>
            <Header
                leftSection={<BackLink to={"/scores"} state={location.state}/>}
                rightSection={<>
                    {auth.currentUser?.isAuthorized &&
                        <ScoreControls
                            primaryButtonLabel={t("button.edit")}
                            primaryButtonVariant={"outline"}
                            secondaryButtonVariant={"outline"}
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

            {score.recording &&
                <Group mb={"md"} maw={400}>
                    <AudioPlayer
                        // @ts-ignore
                        ref={playerRef}
                        src={score.recording}
                        autoPlay={false}
                        layout={"horizontal-reverse"}
                        showJumpControls={false}
                        customVolumeControls={[]}
                        customAdditionalControls={[]}
                        customIcons={{
                            play:
                                <Button size={"compact-lg"} px={4} variant={"subtle"} display={"flex"}
                                        color={theme.colors.dark[9]}>
                                    <PiSpeakerHighFill size={Size.icon.SM}/>
                                </Button>,
                            pause:
                                <Button size={"compact-lg"} px={4} variant={"subtle"} display={"flex"}
                                        color={theme.colors.dark[9]}>
                                    <FaPauseCircle size={Size.icon.SM}/>
                                </Button>
                        }}
                    />
                </Group>}

            <Description>{score.description}</Description>

            <Group justify={"space-between"}>
                <ScorePlaybackPanel/>
                <ScoreSettings settings={AllScoreSettings}/>
            </Group>

            <VoiceFilter/>
            <Stave score={score}/>


            {score.text && <Box>
                <pre style={{whiteSpace: "pre-wrap"}}>{score?.text}</pre>
            </Box>}
        </Page>
    );
}

export default ScoreDetails;
