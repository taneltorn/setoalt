import React, {useEffect, useRef, useState} from "react";
import {Button, Group, Slider, Text, useMantineTheme} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {Size} from "../../../../utils/constants.ts";
import AudioPlayer from "react-h5-audio-player";
import {FaPause, FaPlay} from "react-icons/fa";
import {HiOutlineSpeakerWave, HiOutlineSpeakerXMark} from "react-icons/hi2";
import moment from "moment";

interface Properties {
    recording: string;
}

// note: it seemed easier to implement controls from scratch than to customize react-h5-audio-player :(

const ScoreRecording: React.FC<Properties> = ({recording}) => {

    const {t} = useTranslation();
    const theme = useMantineTheme();

    const playerRef = useRef<AudioPlayer>(null);

    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [volume, setVolume] = useState<number>(0.5);
    const [progress, setProgress] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [isDragging, setIsDragging] = useState<boolean>(false);

    const handlePlayback = () => {
        const audio = playerRef.current?.audio.current;
        if (isPlaying) {
            audio?.pause();
            setIsPlaying(false);
        } else {
            audio?.play();
            setIsPlaying(true);
        }
    };

    const handleVolumeChange = (value: number) => {
        setVolume(value);
        const audio = playerRef.current?.audio.current;
        if (audio) {
            audio.volume = value;
        }
    };

    const handleProgressChange = (value: number) => {
        setProgress(value);
        setIsDragging(true);
    };

    const handleProgressChangeEnd = (value: number) => {
        const audio = playerRef.current?.audio.current;
        if (audio) {
            audio.currentTime = value;
        }
        setProgress(value);
        setIsDragging(false);
    };

    useEffect(() => {
        const audio = playerRef.current?.audio.current;
        if (audio) {
            const updateProgress = () => {
                if (!isDragging) {
                    setProgress(audio.currentTime); // Sync slider progress with audio playback
                }
                setDuration(audio.duration || 0); // Update duration once metadata is loaded
            };

            audio.addEventListener("timeupdate", updateProgress); // Update progress while playing
            audio.addEventListener("loadedmetadata", updateProgress); // Update duration when loaded

            return () => {
                audio.removeEventListener("timeupdate", updateProgress);
                audio.removeEventListener("loadedmetadata", updateProgress);
            };
        }
    }, [playerRef, isDragging]);

    return (
        <Group justify={"start"}>
            <Button variant={"transparent"} px={0} onClick={handlePlayback}>
                {!isPlaying
                    ? <FaPlay
                        title={t("tooltip.startPlaybackRecording")}
                        color={theme.colors.dark[9]}
                        size={Size.icon.XS}
                    />
                    : <FaPause
                        title={t("tooltip.stopPlayback")}
                        size={Size.icon.XS}
                        color={theme.colors.dark[9]}
                    />}
            </Button>

            <div style={{flex: 1}}>
                <Slider
                    value={progress}
                    onChange={handleProgressChange}
                    onChangeEnd={handleProgressChangeEnd}
                    label={moment.utc(progress * 1000).format("mm:ss")}
                    min={0}
                    max={duration || 1}
                    step={1}
                />
            </div>

            <Text>
                {moment.utc(progress * 1000).format("mm:ss")}
            </Text>

            <Button
                px={0}
                variant={"transparent"}
                onClick={() => handleVolumeChange(volume > 0 ? 0 : 0.5)}
            >
                {volume > 0
                    ? <HiOutlineSpeakerWave
                        title={t("tooltip.muteVolume")}
                        size={Size.icon.XS}
                        color={theme.colors.dark[9]}
                    />
                    : <HiOutlineSpeakerXMark
                        title={t("tooltip.unmuteVolume")}
                        size={Size.icon.XS}
                        color={theme.colors.dark[9]}
                    />}
            </Button>

            <Group visibleFrom={"sm"}>
                <Slider
                    title={t("tooltip.volume")}
                    w={100}
                    value={volume}
                    onChange={handleVolumeChange}
                    min={0}
                    max={1}
                    step={0.1}
                    showLabelOnHover={false}
                />
            </Group>

            <AudioPlayer
                // @ts-ignore
                ref={playerRef}
                src={recording}
                autoPlay={false}
                layout={"horizontal-reverse"}
                showJumpControls={false}
                showDownloadProgress={false}
                customVolumeControls={[]}
                customProgressBarSection={[]}
                customControlsSection={[]}
                volume={volume}
                timeFormat={"mm:ss"}
                customAdditionalControls={[]}
            />
        </Group>
    );
};

export default ScoreRecording;
