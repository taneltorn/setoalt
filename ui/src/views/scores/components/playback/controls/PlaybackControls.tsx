import React from 'react';
import {AiFillPauseCircle, AiFillPlayCircle, AiOutlineBackward, AiOutlineForward, AiOutlineUndo,} from "react-icons/ai";
import {useTranslation} from "react-i18next";
import {GiTunePitch} from "react-icons/gi";
import {Button, Group, useMantineTheme} from "@mantine/core";
import {useAudioContext} from "../../../../../context/AudioContext.tsx";
import {useScoreContext} from "../../../../../context/ScoreContext.tsx";
import {DialogType, useDialogContext} from "../../../../../context/DialogContext.tsx";
import {Playback} from "../../../../../utils/constants.ts";
import {IoIosSpeedometer} from "react-icons/io";

const PlaybackControls: React.FC = () => {

    const {t} = useTranslation();
    const theme = useMantineTheme();
    const {isPlaying, startPlayback, stopPlayback, resetPlayback} = useAudioContext();
    const context = useScoreContext();
    const {tempo, transposition} = useAudioContext();
    const {open} = useDialogContext();

    return (
        <Group gap={4}>
            <Button
                px={0}
                title={t("tooltip.playPrevious")}
                color={"gray.4"}
                variant={"transparent"}
                onClick={() => context.previous()}
            >
                <AiOutlineBackward size={40}/>
            </Button>

            {isPlaying
                ? <Button px={0}
                          h={60}
                          title={t("tooltip.stopPlayback")}
                          color={"black"}
                          variant={"transparent"}
                          onClick={() => stopPlayback()}>
                    <AiFillPauseCircle size={60}/>
                </Button>
                : <Button px={0}
                          h={60}
                          title={t("tooltip.startPlayback")}
                          color={theme.primaryColor}
                          variant={"transparent"}
                          onClick={() => startPlayback(context)}>
                    <AiFillPlayCircle size={60}/>
                </Button>}

            <Button
                px={0}
                title={t("tooltip.resetPlayback")}
                color={"gray.4"}
                variant={"transparent"}
                onClick={() => resetPlayback(context)}
            >
                <AiOutlineUndo size={40}/>
            </Button>

            <Button
                px={0}
                title={t("tooltip.playNext")}
                color={"gray.4"}
                variant={"transparent"}
                onClick={() => context.next()}
            >
                <AiOutlineForward size={40}/>
            </Button>

            <Group ml={"md"}>
                <Button
                    px={0}
                    title={t("tooltip.transpose")}
                    color={transposition !== Playback.DEFAULT_TRANSPOSITION ? "black" : "gray.4"}
                    variant={"transparent"}
                    onClick={() => open(DialogType.TRANSPOSE)}
                >
                    <GiTunePitch size={40}/>
                </Button>

                <Button
                    px={0}
                    title={t("tooltip.changeTempo")}
                    color={tempo !== Playback.DEFAULT_TEMPO ? "black" : "gray.4"}
                    variant={"transparent"}
                    onClick={() => open(DialogType.CHANGE_TEMPO)}
                >
                    <IoIosSpeedometer size={40}/>
                </Button>
            </Group>
        </Group>
    );
};

export default PlaybackControls;
