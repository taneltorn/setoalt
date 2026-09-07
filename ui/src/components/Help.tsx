import React from "react";
import {
    ActionIcon,
    Box,
    Button,
    Divider,
    Drawer,
    Grid, Group,
    Kbd,
    Tabs,
    Text, Title,
    useMantineTheme
} from "@mantine/core";
import {Trans, useTranslation} from "react-i18next";
import {useDisclosure} from "@mantine/hooks";
import {
    FaBackward, FaCircle,
    FaForward,
    FaItunesNote, FaPlay,
    FaPlayCircle,
    FaRegTrashAlt
} from "react-icons/fa";
import {Color, Size} from "../utils/constants.ts";
import HelpText from "./HelpText.tsx";
import {MdOutlineCallSplit, MdOutlinePiano, MdRecordVoiceOver, MdVoiceOverOff} from "react-icons/md";
import {GiFClef, GiTunePitch} from "react-icons/gi";
import {IoIosSpeedometer, IoMdRedo, IoMdUndo} from "react-icons/io";
import {IoSettingsOutline} from "react-icons/io5";
import {BsCodeSlash, BsFiletypePng, BsMusicNoteList} from "react-icons/bs";
import {GrReturn} from "react-icons/gr";
import {RxDividerVertical} from "react-icons/rx";
import {FaDeleteLeft} from "react-icons/fa6";
import {RiIncreaseDecreaseFill, RiParenthesesLine} from "react-icons/ri";
import Icon from "@mdi/react";
import {mdiMusicNoteEighth, mdiMusicNoteHalf, mdiMusicNoteQuarter} from "@mdi/js";
import {PiSpeakerSimpleHigh} from "react-icons/pi";
import {ShiftLeftIcons, ShiftRightIcons} from "../utils/icons.tsx";
import {ShiftMode} from "../utils/enums.ts";
import {HiArrowNarrowDown, HiArrowNarrowUp} from "react-icons/hi";

interface Properties {
    tab?: string;
}

// todo: use translation + make dynamic
const Help: React.FC<Properties> = (props) => {

    const {t} = useTranslation();
    const theme = useMantineTheme();
    const [opened, {open, close}] = useDisclosure(false);

    return (
        <Box visibleFrom={"sm"}>
            <ActionIcon
                title={t("page.help")}
                size={Size.icon.MD}
                color={theme.colors.blue[9]}
                onClick={open}
            >
                <Text fw={"bold"}>?</Text>
            </ActionIcon>

            <Drawer opened={opened} onClose={close} title={<Title order={2}>Abi</Title>}>
                <Tabs defaultValue={props.tab || "playback"} radius={"xs"}>
                    <Tabs.List>
                        <Tabs.Tab value="playback">
                            <Group>
                                <PiSpeakerSimpleHigh size={Size.icon.XS}/>
                                <Text size={"md"}>{t("help.listen")}</Text>
                            </Group>
                        </Tabs.Tab>
                        <Tabs.Tab value="editor">
                            <Group>
                                <BsMusicNoteList size={Size.icon.XS}/>
                                <Text size={"md"}>{t("help.write")}</Text>
                            </Group>
                        </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value={"playback"} pt={"xl"}>
                        {t("help.text1")}

                        <Title order={5} my={"md"}>{t("help.voices")}</Title>

                        <HelpText icon={<FaCircle color={Color.voice.TORRO}/>}>
                            {t("help.torre")}
                        </HelpText>

                        <HelpText icon={<FaCircle color={Color.voice.KILLO}/>}>
                            {t("help.kille")}
                        </HelpText>

                        <HelpText icon={<FaCircle color={Color.voice.BOTTOM_TORRO}/>}>
                            {t("help.lowTorre")}
                        </HelpText>

                        <HelpText icon={<FaCircle color={Color.voice.FRONT}/>}>
                            {t("help.frontVoice")}
                        </HelpText>

                        <HelpText icon={<HiArrowNarrowUp color={Color.voice.TORRO}/>}>
                            {t("help.noteHigher")}
                        </HelpText>
                        <HelpText icon={<HiArrowNarrowDown color={Color.voice.TORRO}/>}>
                            {t("help.noteLower")}
                        </HelpText>

                        <Title order={6} my={"md"}>{t("help.voiceControl")}</Title>

                        {t("help.voiceControlText")}
                        <br/>
                        <br/>
                        <Trans i18nKey="help.voiceControlText2"  components={{kbd: <Kbd/>}}/>

                        <Grid mt={"md"}>
                            <Grid.Col span={3}>
                                <Button
                                    color={"black"}
                                    size={"compact-sm"}
                                    leftSection={<MdRecordVoiceOver size={Size.icon.SM}/>}>
                                    torrõ
                                </Button>
                            </Grid.Col>
                            <Grid.Col span={9}>
                                {t("help.voiceOn")}
                            </Grid.Col>
                        </Grid>
                        <Grid>
                            <Grid.Col span={3}>
                                <Button
                                    c={"black"}
                                    color={"gray.1"}
                                    size={"compact-sm"}
                                    leftSection={<MdRecordVoiceOver color={"black"} size={Size.icon.SM}/>}>
                                    torrõ
                                </Button>
                            </Grid.Col>
                            <Grid.Col span={9}>
                                {t("help.voiceOnNotVisible")}
                            </Grid.Col>
                        </Grid>
                        <Grid>
                            <Grid.Col span={3}>
                                <Button
                                    c={"gray.5"}
                                    color={"gray.1"}
                                    size={"compact-sm"}
                                    leftSection={<MdVoiceOverOff size={Size.icon.SM}/>}>
                                    torrõ
                                </Button>
                            </Grid.Col>
                            <Grid.Col span={9}>
                                {t("help.voiceOff")}
                            </Grid.Col>
                        </Grid>

                        <Divider my={"md"}/>

                        <Title order={5} mb={"md"}>{t("help.buttons")}</Title>

                        <HelpText icon={<FaPlay size={Size.icon.XS}/>}>
                            {t("help.listenToArchiveRecording")}
                        </HelpText>

                        <HelpText icon={<MdOutlinePiano size={Size.icon.SM}/>}>
                            {t("help.changeOutput")}
                        </HelpText>

                        <HelpText icon={<FaBackward size={Size.icon.SM}/>}>
                            {t("help.prevNote")}
                            Vali eelmine noot.
                        </HelpText>

                        <HelpText icon={<FaPlayCircle color={theme.colors.red[9]} size={Size.icon.SM}/>}>
                            <Trans i18nKey="help.playbackText"  components={{kbd: <Kbd/>}}/>
                        </HelpText>

                        <HelpText icon={<FaForward size={Size.icon.SM}/>}>
                            {t("help.nextNote")}
                        </HelpText>

                        <Divider my={"md"}/>

                        <HelpText icon={<GiTunePitch color={theme.colors.gray[5]} size={Size.icon.SM}/>}>
                            {t("help.adjustVolume")}
                        </HelpText>

                        <HelpText icon={<IoIosSpeedometer color={theme.colors.gray[5]} size={Size.icon.SM}/>}>
                            {t("help.adjustTempo")}
                        </HelpText>

                        <Divider my={"md"}/>

                        <HelpText icon={<IoSettingsOutline size={Size.icon.SM}/>}>
                            {t("help.openSettings")}
                        </HelpText>

                        <HelpText icon={<FaItunesNote size={Size.icon.SM}/>}>
                            {t("help.switchMode")}
                        </HelpText>

                        <HelpText icon={<BsCodeSlash size={Size.icon.SM}/>}>
                            {t("help.displayEmbedding")}
                        </HelpText>

                        <HelpText icon={<BsFiletypePng size={Size.icon.SM}/>}>
                            {t("help.downloadPng")}
                        </HelpText>
                    </Tabs.Panel>

                    <Tabs.Panel value={"editor"} pt={"xl"}>
                        {t("help.editorText")}

                        <Title order={5} my={"md"}>{t("help.voiceActivation")}</Title>
                        <Trans i18nKey="help.voiceActivationText"  components={{kbd: <Kbd/>}}/>

                        <Grid mt={"md"}>
                            <Grid.Col span={3}>
                                <Button
                                    color={"black"}
                                    size={"compact-sm"}
                                    leftSection={<MdRecordVoiceOver size={Size.icon.SM}/>}>
                                    torrõ
                                </Button>
                            </Grid.Col>
                            <Grid.Col span={9}>
                                {t("help.voiceActive")}
                            </Grid.Col>
                        </Grid>

                        <Grid>
                            <Grid.Col span={3}>
                                <Button
                                    c={"black"}
                                    color={"gray.1"}
                                    size={"compact-sm"}
                                    leftSection={<MdRecordVoiceOver color={"black"} size={Size.icon.SM}/>}>
                                    torrõ
                                </Button>
                            </Grid.Col>
                            <Grid.Col span={9}>
                                {t("help.voiceActiveNotVisible")}
                            </Grid.Col>
                        </Grid>

                        <Grid>
                            <Grid.Col span={3}>
                                <Button
                                    c={"gray.5"}
                                    color={"gray.1"}
                                    size={"compact-sm"}
                                    leftSection={<MdVoiceOverOff size={Size.icon.SM}/>}>
                                    torrõ
                                </Button>
                            </Grid.Col>
                            <Grid.Col span={9}>
                                {t("help.voiceNotActive")}
                            </Grid.Col>
                        </Grid>

                        <Divider my={"md"}/>

                        <Title order={5} mb={"md"}>{t("help.buttons")}</Title>

                        <HelpText icon={<GiFClef size={Size.icon.SM}/>}>
                            {t("help.changeScale")}
                        </HelpText>

                        <Divider my={"md"}/>

                        <HelpText icon={<strong>D, E♭, F♯, ...</strong>}>
                            {t("help.addNote")}
                        </HelpText>

                        <HelpText icon={<RiIncreaseDecreaseFill size={Size.icon.XS}/>}>
                            {t("help.adjustPitch")}
                        </HelpText>

                        <Divider my={"md"}/>

                        <HelpText icon={<Icon path={mdiMusicNoteHalf} size={1}/>}>
                            {t("help.toHalfNote")}
                        </HelpText>

                        <HelpText icon={<Icon path={mdiMusicNoteQuarter} size={1}/>}>
                            {t("help.toQuarterNote")}
                        </HelpText>

                        <HelpText icon={<Icon path={mdiMusicNoteEighth} size={1}/>}>
                            {t("help.toEightNote")}
                        </HelpText>

                        <HelpText icon={<MdOutlineCallSplit size={Size.icon.XS}/>}>
                            {t("help.splitNote")}
                        </HelpText>

                        <Divider my={"md"}/>

                        <HelpText icon={<RiParenthesesLine size={Size.icon.SM}/>}>
                            {t("help.adjustNoteSize")}
                        </HelpText>

                        <Divider my={"md"}/>

                        <HelpText icon={<GrReturn size={Size.icon.SM}/>}>
                            {t("help.addBreak")}
                        </HelpText>

                        <HelpText icon={<RxDividerVertical size={Size.icon.SM}/>}>
                            {t("help.addSeparator")}
                        </HelpText>

                        <HelpText icon={ShiftLeftIcons.get(ShiftMode.NOTES)}>
                            {t("help.shiftLeft")}
                        </HelpText>

                        <HelpText icon={ShiftRightIcons.get(ShiftMode.NOTES)}>
                            {t("help.shiftRight")}
                        </HelpText>

                        <HelpText icon={ShiftLeftIcons.get(ShiftMode.LYRICS)}>
                            <Trans i18nKey="help.shiftLyricsLeft"  components={{kbd: <Kbd/>}}/>

                        </HelpText>

                        <HelpText icon={ShiftRightIcons.get(ShiftMode.LYRICS)}>
                            <Trans i18nKey="help.shiftLyricsRight"  components={{kbd: <Kbd/>}}/>
                        </HelpText>

                        <HelpText icon={ShiftLeftIcons.get(ShiftMode.VOICES)}>
                            <Trans i18nKey="help.shiftVoicesLeft"  components={{kbd: <Kbd/>}}/>
                        </HelpText>

                        <HelpText icon={ShiftRightIcons.get(ShiftMode.VOICES)}>
                            <Trans i18nKey="help.shiftVoicesRight"  components={{kbd: <Kbd/>}}/>
                        </HelpText>

                        <HelpText icon={<FaDeleteLeft size={Size.icon.SM}/>}>
                            {t("help.removeNote")}
                        </HelpText>

                        <Divider my={"md"}/>

                        <HelpText icon={<IoMdUndo size={Size.icon.SM}/>}>
                            {t("help.undo")}
                        </HelpText>

                        <HelpText icon={<IoMdRedo size={Size.icon.SM}/>}>
                            {t("help.redo")}
                        </HelpText>

                        <HelpText icon={<FaRegTrashAlt size={Size.icon.XS}/>}>
                            {t("help.reset")}

                        </HelpText>
                    </Tabs.Panel>
                </Tabs>
            </Drawer>
        </Box>
    );
}

export default Help;
