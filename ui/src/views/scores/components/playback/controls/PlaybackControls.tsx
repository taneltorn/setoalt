import React from 'react';
import {useTranslation} from "react-i18next";
import {GiTunePitch} from "react-icons/gi";
import {ActionIcon, Box, Group, Slider} from "@mantine/core";
import {useAudioContext} from "../../../../../hooks/useAudioContext.tsx";
import {useScoreContext} from "../../../../../hooks/useScoreContext.tsx";
import {useDialogContext} from "../../../../../hooks/useDialogContext.tsx";
import {Playback, Size} from "../../../../../utils/constants.ts";
import {IoIosSpeedometer} from "react-icons/io";
import InstrumentSelection from "./InstrumentSelection.tsx";
import {FaBackward, FaForward, FaPauseCircle, FaPlayCircle} from "react-icons/fa";
import {getDetuneLabel, getTempoLabel} from "../../../../../utils/helpers.tsx";
import ValueIndicator from "./ValueIndicator.tsx";
import {DialogType} from "../../../../../utils/enums.ts";

const PlaybackControls: React.FC = () => {

    const {t} = useTranslation();
    const context = useScoreContext();
    const {open} = useDialogContext();
    const {isPlaying, startPlayback, stopPlayback} = useAudioContext();
    const {tempo, transposition, volume, setVolume} = useAudioContext();

    return (
        <Group gap={"xl"}>
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
                        {<FaPlayCircle size={Size.icon.XL}/>}
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
            </Group>
            <Group gap={"xs"}>
                <Group>
                    <Box style={{position: "relative", top: 10}} size={75} ml={-24}>
                        <Group justify={"center"}>
                            <ActionIcon
                                size={"xl"}
                                title={t("tooltip.transpose")}
                                color={transposition !== Playback.DEFAULT_TRANSPOSITION ? "black" : "gray.4"}
                                variant={"subtle"}
                                onClick={() => open(DialogType.TRANSPOSE)}
                            >
                                <GiTunePitch size={Size.icon.XL}/>
                            </ActionIcon>
                        </Group>
                        <ValueIndicator label={getDetuneLabel(transposition, t("unit.semitonesAbbr"))}/>
                    </Box>

                    <Box style={{position: "relative", top: 10}} size={200} ml={-32}>
                        <Group justify={"center"} align={"center"}>
                            <ActionIcon
                                size={"xl"}
                                title={t("tooltip.changeTempo")}
                                color={tempo !== (context.score.defaultTempo || Playback.DEFAULT_TEMPO) ? "black" : "gray.4"}
                                variant={"subtle"}
                                onClick={() => open(DialogType.CHANGE_TEMPO)}
                            >
                                <IoIosSpeedometer size={Size.icon.XL}/>
                            </ActionIcon>
                        </Group>
                        <ValueIndicator label={getTempoLabel(tempo, context.score.defaultTempo)}/>
                    </Box>

                </Group>
                <Slider
                    w={200}
                    size={"md"}
                    min={Playback.MIN_VOLUME}
                    max={Playback.MAX_VOLUME}
                    step={Playback.VOLUME_STEP}
                    label={t(`tooltip.changeVolume`)}
                    value={volume}
                    onChange={v => setVolume(v)}
                />
            </Group>
        </Group>
    );
};

export default PlaybackControls;
