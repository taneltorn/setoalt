import React from 'react';
import {useTranslation} from "react-i18next";
import {GiTunePitch} from "react-icons/gi";
import {ActionIcon, Box, Button, Group, Slider, Tooltip, useMantineTheme} from "@mantine/core";
import {useAudioContext} from "../../../../../hooks/useAudioContext.tsx";
import {useScoreContext} from "../../../../../hooks/useScoreContext.tsx";
import {useDialogContext} from "../../../../../hooks/useDialogContext.tsx";
import {Playback, Size} from "../../../../../utils/constants.ts";
import {IoIosSpeedometer} from "react-icons/io";
import InstrumentSelection from "./InstrumentSelection.tsx";
import {FaBackward, FaForward, FaPauseCircle, FaPlayCircle} from "react-icons/fa";
import {
    getDetuneLabel,
    getTempoLabel,
} from "../../../../../utils/helpers.tsx";
import ValueIndicator from "../../../../../components/ValueIndicator.tsx";
import {DialogType} from "../../../../../utils/enums.ts";
import {HiOutlineSpeakerWave, HiOutlineSpeakerXMark} from "react-icons/hi2";
import {TbRepeat} from "react-icons/tb";

const PlaybackControls: React.FC = () => {

    const {t} = useTranslation();
    const theme = useMantineTheme();

    const context = useScoreContext();
    const {open} = useDialogContext();
    const {isPlaying, startPlayback, stopPlayback} = useAudioContext();
    const {tempo, transposition, volume, setVolume, isSwitching} = useAudioContext();

    return (
        <Group gap={4}>
            <Group gap={0}>
                <InstrumentSelection/>
                <Tooltip label={t("tooltip.playPrevious")}>
                    <ActionIcon
                        size={"xl"}
                        color={"black"}
                        variant={"subtle"}
                        onClick={() => context.previous()}
                    >
                        <FaBackward size={Size.icon.SM}/>
                    </ActionIcon>
                </Tooltip>

                {isPlaying
                    ?
                    <Tooltip label={t("tooltip.stopPlayback")}>
                        <ActionIcon
                            size={Size.icon.XL}
                            title={t("tooltip.stopPlayback")}
                            color={"black"}
                            variant={"subtle"}
                            onClick={() => stopPlayback()}
                        >
                            <FaPauseCircle size={Size.icon.XL}/>
                        </ActionIcon>
                    </Tooltip>
                    :
                    <Tooltip label={t(`tooltip.${context.loopRange ? "startPlaybackRepeat" : "startPlayback"}`)}>
                        <ActionIcon
                            size={Size.icon.XL}
                            variant={"subtle"}
                            disabled={isSwitching}
                            onClick={() => startPlayback(context)}
                        >
                            {<FaPlayCircle size={Size.icon.XL}/>}
                        </ActionIcon>
                    </Tooltip>}

                <Tooltip label={t("tooltip.playNext")}>
                    <ActionIcon
                        size={"xl"}
                        color={"black"}
                        variant={"subtle"}
                        onClick={() => context.next()}
                    >
                        <FaForward size={Size.icon.SM}/>
                    </ActionIcon>
                </Tooltip>

                <Tooltip label={t("tooltip.selectLoopRange")}>
                    <ActionIcon
                        size="xl"
                        variant={context.isLoopSelectionMode ? "filled" : "subtle"}
                        color={context.isLoopSelectionMode ? "red" : "black"}
                        onClick={() =>
                            context.setIsLoopSelectionMode(!context.isLoopSelectionMode)
                        }
                    >
                        <TbRepeat size={Size.icon.MD}/>
                    </ActionIcon>
                </Tooltip>
            </Group>

            <Group gap={0}>
                <Group ms={"md"}>
                    <Tooltip label={t(`tooltip.${volume > Playback.MIN_VOLUME ? "muteVolume" : "unmuteVolume"}`)}>
                        <Button
                            px={0}
                            variant={"transparent"}
                            onClick={() => setVolume(volume > Playback.MIN_VOLUME ? Playback.MIN_VOLUME : Playback.DEFAULT_VOLUME)}
                        >
                            {volume > Playback.MIN_VOLUME
                                ? <HiOutlineSpeakerWave
                                    title={t("tooltip.muteVolume")}
                                    size={Size.icon.SM}
                                    color={theme.colors.dark[9]}
                                />
                                : <HiOutlineSpeakerXMark
                                    title={t("tooltip.unmuteVolume")}
                                    size={Size.icon.SM}
                                    color={theme.colors.dark[9]}
                                />}
                        </Button>
                    </Tooltip>

                    <Slider
                        title={t(`tooltip.changeVolume`)}
                        visibleFrom={"sm"}
                        w={200}
                        size={"md"}
                        min={Playback.MIN_VOLUME}
                        max={Playback.MAX_VOLUME}
                        step={Playback.VOLUME_STEP}
                        showLabelOnHover={false}
                        value={volume}
                        onChange={v => setVolume(v)}
                    />
                </Group>

                <Group gap={0} ms={"md"}>
                    <Box style={{position: "relative", top: 7}} w={54}>
                        <Group justify={"center"}>
                            <Tooltip label={t("tooltip.transpose")}>
                                <ActionIcon
                                    size={"xl"}
                                    color={transposition !== Playback.DEFAULT_TRANSPOSITION ? "black" : "gray.4"}
                                    variant={"subtle"}
                                    onClick={() => open(DialogType.TRANSPOSE)}
                                >
                                    <GiTunePitch size={Size.icon.MD}/>
                                </ActionIcon>
                            </Tooltip>
                        </Group>
                        <ValueIndicator label={getDetuneLabel(transposition, t("unit.semitonesAbbr"))}/>
                    </Box>

                    <Box style={{position: "relative", top: 7}} w={54}>
                        <Group justify={"center"} align={"center"}>
                            <Tooltip label={t("tooltip.changeTempo")}>
                                <ActionIcon
                                    size={"xl"}
                                    color={tempo !== (context.score.defaultTempo || Playback.DEFAULT_TEMPO) ? "black" : "gray.4"}
                                    variant={"subtle"}
                                    onClick={() => open(DialogType.CHANGE_TEMPO)}
                                >
                                    <IoIosSpeedometer size={Size.icon.MD}/>
                                </ActionIcon>
                            </Tooltip>
                        </Group>
                        <ValueIndicator label={getTempoLabel(tempo, context.score.defaultTempo)}/>
                    </Box>
                </Group>
            </Group>
        </Group>
    );
};

export default PlaybackControls;
