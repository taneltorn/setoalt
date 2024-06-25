import React from 'react';
import {useTranslation} from "react-i18next";
import {GiTunePitch} from "react-icons/gi";
import {ActionIcon, Group} from "@mantine/core";
import {useAudioContext} from "../../../../../context/AudioContext.tsx";
import {useScoreContext} from "../../../../../context/ScoreContext.tsx";
import {DialogType, useDialogContext} from "../../../../../context/DialogContext.tsx";
import {Playback, Size} from "../../../../../utils/constants.ts";
import {IoIosSpeedometer} from "react-icons/io";
import InstrumentSelection from "./InstrumentSelection.tsx";
import {PiRepeatFill} from "react-icons/pi";
import {FaBackward, FaForward, FaPauseCircle, FaPlayCircle} from "react-icons/fa";
import {getDetuneLabel, getTempoLabel} from "../../../../../utils/helpers.tsx";
import ValueIndicator from "./ValueIndicator.tsx";

const PlaybackControls: React.FC = () => {

    const {t} = useTranslation();
    const {isPlaying, startPlayback, stopPlayback} = useAudioContext();
    const context = useScoreContext();
    const {tempo, transposition} = useAudioContext();
    const {open} = useDialogContext();

    return (
        <Group gap={"xs"}>
            <InstrumentSelection/>

            <ActionIcon
                size={"xl"}
                title={t("tooltip.playPrevious")}
                color={"black"}
                variant={"subtle"}
                onClick={() => context.previous()}
            >
                <FaBackward size={Size.icon.MD}/>
            </ActionIcon>

            {isPlaying
                ? <ActionIcon
                    size={Size.icon.XL}
                    title={t("tooltip.stopPlayback")}
                    color={"black"}
                    variant={"subtle"}
                    onClick={() => stopPlayback()}
                >
                    <FaPauseCircle size={Size.icon.XL}/>
                </ActionIcon>
                : <ActionIcon
                    size={Size.icon.XL}
                    title={t(`tooltip.${context.loopRange ? "startPlaybackRepeat" : "startPlayback"}`)}
                    variant={"subtle"}
                    onClick={() => startPlayback(context)}
                >
                    {context.loopRange
                        ? <PiRepeatFill size={Size.icon.XL}/>
                        : <FaPlayCircle size={Size.icon.XL}/>}
                </ActionIcon>}

            <ActionIcon
                size={"xl"}
                title={t("tooltip.playNext")}
                color={"black"}
                variant={"subtle"}
                onClick={() => context.next()}
            >
                <FaForward size={Size.icon.MD}/>
            </ActionIcon>

            <Group ml={"md"}>
                <Group>
                    <ActionIcon
                        size={"xl"}
                        title={t("tooltip.transpose")}
                        color={transposition !== Playback.DEFAULT_TRANSPOSITION ? "black" : "gray.4"}
                        variant={"subtle"}
                        onClick={() => open(DialogType.TRANSPOSE)}
                    >
                        <GiTunePitch size={Size.icon.XL}/>
                        <ValueIndicator
                            visible={transposition !== Playback.DEFAULT_TRANSPOSITION}
                            label={getDetuneLabel(transposition, t("unit.semitonesAbbr"))}
                        />
                    </ActionIcon>
                </Group>

                <ActionIcon
                    size={"xl"}
                    title={t("tooltip.changeTempo")}
                    color={tempo !== (context.score.defaultTempo || Playback.DEFAULT_TEMPO) ? "black" : "gray.4"}
                    variant={"subtle"}
                    onClick={() => open(DialogType.CHANGE_TEMPO)}
                >
                    <IoIosSpeedometer size={Size.icon.XL}/>
                    <ValueIndicator
                        visible={tempo !== context.score.defaultTempo}
                        label={getTempoLabel(tempo, context.score.defaultTempo)}
                    />
                </ActionIcon>
            </Group>
        </Group>
    );
};

export default PlaybackControls;
