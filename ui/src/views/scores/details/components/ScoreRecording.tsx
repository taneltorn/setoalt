import React, {createRef} from "react";
import {Group, useMantineTheme} from "@mantine/core";
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
        <Group maw={400} mb={"sm"}>
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
                        <PiSpeakerHighFill
                            title={t("tooltip.startPlayback")}
                            size={Size.icon.MD}
                            color={theme.colors.dark[9]}
                        />,
                    pause:
                        <FaPauseCircle
                            title={t("tooltip.stopPlayback")}
                            size={Size.icon.MD} color={theme.colors.dark[9]}
                        />
                }}
            />
        </Group>
    );
}

export default ScoreRecording;
