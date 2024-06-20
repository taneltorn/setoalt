import React from 'react';
import {AiFillPauseCircle, AiFillPlayCircle, AiOutlineBackward, AiOutlineForward, AiOutlineUndo,} from "react-icons/ai";
import {useTranslation} from "react-i18next";
import {GiTunePitch} from "react-icons/gi";
import {Button, Group, useMantineTheme} from "@mantine/core";
import {useAudioContext} from "../../../../../context/AudioContext.tsx";
import {useScoreContext} from "../../../../../context/ScoreContext.tsx";
import {DialogType, useDialogContext} from "../../../../../context/DialogContext.tsx";

const PlaybackControls: React.FC = () => {

    const {t} = useTranslation();
    const theme = useMantineTheme();
    const {isPlaying, startPlayback, stopPlayback, resetPlayback} = useAudioContext();
    const context = useScoreContext();
    const {open} = useDialogContext();

    return (
        <Group gap={"xs"}>
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

            <Button
                px={0}
                title={t("tooltip.transpose")}
                color={context.transposition !== 0 ? "black" : "gray.4"}
                variant={"transparent"}
                onClick={() => open(DialogType.TRANSPOSE)}
            >
                <GiTunePitch size={40}/>
            </Button>
        </Group>
    );
};

export default PlaybackControls;
