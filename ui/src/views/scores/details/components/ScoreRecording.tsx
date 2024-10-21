import React, {createRef} from "react";
import {Button, Group, useMantineTheme} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {Size} from "../../../../utils/constants.ts";
import AudioPlayer from "react-h5-audio-player";
import {PiSpeakerHighFill} from "react-icons/pi";
import {FaPauseCircle} from "react-icons/fa";

interface Properties {
    recording: string;
}

const ScoreRecording: React.FC<Properties> = ({recording}) => {

    const playerRef = createRef();

    const [t] = useTranslation();
    const theme = useMantineTheme();

    return (
        <Group maw={400}>
            <AudioPlayer
                // @ts-ignore
                ref={playerRef}
                src={recording}
                autoPlay={false}
                layout={"horizontal-reverse"}
                showJumpControls={false}
                customVolumeControls={[]}
                customAdditionalControls={[]}
                customIcons={{
                    play:
                        <Button size={"compact-lg"} px={4} variant={"subtle"} display={"flex"}
                                title={t("tooltip.startPlayback")}
                                color={theme.colors.dark[9]}>
                            <PiSpeakerHighFill size={Size.icon.SM}/>
                        </Button>,
                    pause:
                        <Button size={"compact-lg"} px={4} variant={"subtle"} display={"flex"}
                                title={t("tooltip.stopPlayback")}
                                color={theme.colors.dark[9]}>
                            <FaPauseCircle size={Size.icon.SM}/>
                        </Button>
                }}
            />
        </Group>
    );
}

export default ScoreRecording;
