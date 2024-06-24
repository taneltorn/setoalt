import React from 'react';
import {useTranslation} from "react-i18next";
import {GiTunePitch} from "react-icons/gi";
import {Button, Group, useMantineTheme} from "@mantine/core";
import {useAudioContext} from "../../../../../context/AudioContext.tsx";
import {useScoreContext} from "../../../../../context/ScoreContext.tsx";
import {DialogType, useDialogContext} from "../../../../../context/DialogContext.tsx";
import {Playback} from "../../../../../utils/constants.ts";
import {IoIosSpeedometer} from "react-icons/io";
import InstrumentSelection from "./InstrumentSelection.tsx";
import {PiRepeatFill} from "react-icons/pi";
import {FaBackward, FaForward, FaPauseCircle, FaPlayCircle} from "react-icons/fa";

const PlaybackControls: React.FC = () => {

    const {t} = useTranslation();
    const theme = useMantineTheme();
    const {isPlaying, startPlayback, stopPlayback} = useAudioContext();
    const context = useScoreContext();
    const {tempo, transposition} = useAudioContext();
    const {open} = useDialogContext();

    const LG = 70;
    const SM = 40;

    return (
        <Group gap={4}>
            <InstrumentSelection/>

            <Button
                px={"xs"}
                h={SM}
                title={t("tooltip.playPrevious")}
                color={"gray.4"}
                variant={"transparent"}
                onClick={() => context.previous()}
            >
                <FaBackward size={SM}/>
            </Button>

            {isPlaying
                ? <Button
                    px={0}
                    h={LG}
                    title={t("tooltip.stopPlayback")}
                    color={"black"}
                    variant={"transparent"}
                    onClick={() => stopPlayback()}
                >
                    <FaPauseCircle size={LG}/>
                </Button>
                : <Button
                    px={0}
                    h={LG}
                    title={t(`tooltip.${context.loopRange ? "startPlaybackRepeat" : "startPlayback"}`)}
                    color={theme.primaryColor}
                    variant={"transparent"}
                    onClick={() => startPlayback(context)}
                >
                    {context.loopRange
                        ? <PiRepeatFill size={LG}/>
                        : <FaPlayCircle size={LG}/>}
                </Button>}

            <Button
                px={"xs"}
                h={SM}
                title={t("tooltip.playNext")}
                color={"gray.4"}
                variant={"transparent"}
                onClick={() => context.next()}
            >
                <FaForward size={SM}/>
            </Button>

            <Group ml={"md"}>
                <Button
                    px={0}
                    title={t("tooltip.transpose")}
                    color={transposition !== Playback.DEFAULT_TRANSPOSITION ? "black" : "gray.4"}
                    variant={"transparent"}
                    onClick={() => open(DialogType.TRANSPOSE)}
                >
                    <GiTunePitch size={SM}/>
                </Button>

                <Button
                    px={0}
                    title={t("tooltip.changeTempo")}
                    color={tempo !== Playback.DEFAULT_TEMPO ? "black" : "gray.4"}
                    variant={"transparent"}
                    onClick={() => open(DialogType.CHANGE_TEMPO)}
                >
                    <IoIosSpeedometer size={SM}/>
                </Button>
            </Group>
        </Group>
    );
};

export default PlaybackControls;
