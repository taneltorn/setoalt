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
import {useTranslation} from "react-i18next";
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
                                <Text size={"md"}>Kuula</Text>
                            </Group>
                        </Tabs.Tab>
                        <Tabs.Tab value="editor">
                            <Group>
                                <BsMusicNoteList size={Size.icon.XS}/>
                                <Text size={"md"}>Redaktor</Text>
                            </Group>
                        </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value={"playback"} pt={"xl"}>
                        Siin saad kuulata loodud noodistusi.

                        <Title order={5} my={"md"}>Hääled</Title>

                        <HelpText icon={<FaCircle color={Color.voice.TORRO}/>}>
                            Torrõ
                        </HelpText>

                        <HelpText icon={<FaCircle color={Color.voice.KILLO}/>}>
                            Killõ
                        </HelpText>

                        <HelpText icon={<FaCircle color={Color.voice.BOTTOM_TORRO}/>}>
                            Alumine torrõ
                        </HelpText>

                        <HelpText icon={<FaCircle color={Color.voice.FRONT}/>}>
                            Eeslaul
                        </HelpText>

                        <HelpText icon={<HiArrowNarrowUp color={Color.voice.TORRO}/>}>
                            Nooti on mikrotonaalselt kõrgendatud
                        </HelpText>
                        <HelpText icon={<HiArrowNarrowDown color={Color.voice.TORRO}/>}>
                            Nooti on mikrotonaalselt madaldatud
                        </HelpText>

                        <Title order={6} my={"md"}>Häälte sisse/välja lülilitamine</Title>

                        Hääli saad sisse ja välja lülitada vajutades vastava hääle nupul. Välja lülitatud hääli ei
                        kuvata noodistusel ega esitada vastavat heli.
                        <br/>
                        Hoides all <Kbd>Ctrl</Kbd> klahvi on võimalik hääl peita, kuid jätta see taasesitusel siiski
                        kõlama.
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
                                Hääl on sisse lülitatud.
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
                                Hääl on sisse lülitatud, kuid ei ole nähtav. Heli kõlab taasesitusel.
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
                                Hääl on välja lülitatud.
                            </Grid.Col>
                        </Grid>

                        <Divider my={"md"}/>

                        <Title order={5} mb={"md"}>Nupud</Title>

                        <HelpText icon={<FaPlay size={Size.icon.XS}/>}>
                            Kuula arhiivisalvestust.
                        </HelpText>

                        <HelpText icon={<MdOutlinePiano size={Size.icon.SM}/>}>
                            Muuda heliväljundit. Valida saab klaveri (vaikimisi), süntesaatori, viiuli, flöödi ja
                            kitarri vahel.
                        </HelpText>

                        <HelpText icon={<FaBackward size={Size.icon.SM}/>}>
                            Vali eelmine noot.
                        </HelpText>

                        <HelpText icon={<FaPlayCircle color={theme.colors.red[9]} size={Size.icon.SM}/>}>
                            Noodistuse mahamängimine. Lõigu korduvaks esitamiseks vali kõigepealt soovitud
                            algusnoot ning seejärel <Kbd>Ctrl</Kbd> klahvi all hoides lõpunoot.
                        </HelpText>

                        <HelpText icon={<FaForward size={Size.icon.SM}/>}>
                            Vali järgmine noot.
                        </HelpText>

                        <Divider my={"md"}/>

                        <HelpText icon={<GiTunePitch color={theme.colors.gray[5]} size={Size.icon.SM}/>}>
                            Muuda taasesituse üldist helikõrgust madalamaks või kõrgemaks.
                        </HelpText>

                        <HelpText icon={<IoIosSpeedometer color={theme.colors.gray[5]} size={Size.icon.SM}/>}>
                            Muuda esitustempot aeglasemaks või kiiremaks.
                        </HelpText>

                        <Divider my={"md"}/>

                        <HelpText icon={<IoSettingsOutline size={Size.icon.SM}/>}>
                            Ava noodistuse sätted.
                        </HelpText>

                        <HelpText icon={<FaItunesNote size={Size.icon.SM}/>}>
                            Vali noodistuse lihtsustatud või detailvaate vahel. Lihtsustatud vaates ei kuvata
                            noodijoonte helikõrgusi ega üles-alla noolekesi (mikrotonaalsuse näitajaid).
                        </HelpText>

                        <HelpText icon={<BsCodeSlash size={Size.icon.SM}/>}>
                            Kuva noodistuse manustamiskood. Vastava koodi saab lisada välisele veebilehele (nt
                            laul.setomaa.ee).
                        </HelpText>

                        <HelpText icon={<BsFiletypePng size={Size.icon.SM}/>}>
                            Lae alla noodistuse pildifail (.png).
                        </HelpText>
                    </Tabs.Panel>

                    <Tabs.Panel value={"editor"} pt={"xl"}>
                        Redaktor võimaldab katsetada noodistuste loomisega.

                        <Title order={5} my={"md"}>Hääle aktiveerimine</Title>
                        Aktiivse hääle valimisel seotakse kõik järgnevalt lisatud noodid antud häälega. Kõik teised
                        hääled peidetakse, st heli taasesitamisel vastavad hääled ei kõla, kuid jäävad noodijoonestikus
                        siiski õrnalt nähtavale. Erinevaid häälekombinatsioone on võimalik valida <Kbd>Ctrl</Kbd> nuppu
                        all hoides.

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
                                Hääl on aktiivne.
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
                                Hääl ei ole aktiivne, kuid noodid on täielikult nähtavad ja kõlavad taasesitusel.
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
                                Hääl ei ole aktiivne, noodid on õrnalt nähtaval ja ei kõla taasesitusel.
                            </Grid.Col>
                        </Grid>

                        <Divider my={"md"}/>

                        <Title order={5} mb={"md"}>Nupud</Title>

                        <HelpText icon={<GiFClef size={Size.icon.SM}/>}>
                            Vaheta noodijoonestikku. Valida saab pooltoon-poolteisttoon- (PPT), vanema ja uuema
                            diatoonilise helirea
                            vahel. Noodijoonestikku saab vahetada üksnes uue noodistuse puhul.
                        </HelpText>

                        <Divider my={"md"}/>

                        <HelpText icon={<RiIncreaseDecreaseFill size={Size.icon.XS}/>}>
                            Muuda valitud noodi helikõrgust tsentides.
                        </HelpText>

                        <Divider my={"md"}/>

                        <HelpText icon={<Icon path={mdiMusicNoteHalf} size={1}/>}>
                            Muuda valitud noot poolnoodiks.
                        </HelpText>

                        <HelpText icon={<Icon path={mdiMusicNoteQuarter} size={1}/>}>
                            Muuda valitud noot veerandnoodiks.
                        </HelpText>

                        <HelpText icon={<Icon path={mdiMusicNoteEighth} size={1}/>}>
                            Muuda valitud noot kaheksandiknoodiks.
                        </HelpText>

                        <HelpText icon={<MdOutlineCallSplit size={Size.icon.XS}/>}>
                            Poolita valitud kaheksandiknoot kaheks kuueteistkümnendiknoodiks.
                        </HelpText>

                        <Divider my={"md"}/>

                        <HelpText icon={<RiParenthesesLine size={Size.icon.SM}/>}>
                            Muuda valitud noodi suurust. Esimene vajutus muudab noodi väiksemaks, teine taastab algse
                            suuruse.
                        </HelpText>


                        <Divider my={"md"}/>

                        <HelpText icon={<GrReturn size={Size.icon.SM}/>}>
                            Lisa reavahe.
                        </HelpText>

                        <HelpText icon={<RxDividerVertical size={Size.icon.SM}/>}>
                            Lisa eraldaja. Esimene vajutus lisab täispika eraldaja, teine vajutus muudab selle lühemaks
                            ning kolmas eemaldab.
                        </HelpText>

                        <HelpText icon={ShiftLeftIcons.get(ShiftMode.NOTES)}>
                            Nihuta noote vasakule.
                        </HelpText>

                        <HelpText icon={ShiftRightIcons.get(ShiftMode.NOTES)}>
                            Nihuta noote paremale.
                        </HelpText>

                        <HelpText icon={ShiftLeftIcons.get(ShiftMode.LYRICS)}>
                            Nihuta laulusõnu vasakule. Vajalik <Kbd>Ctrl</Kbd> nupu all hoidmine.
                        </HelpText>

                        <HelpText icon={ShiftRightIcons.get(ShiftMode.LYRICS)}>
                            Nihuta laulusõnu paremale. Vajalik <Kbd>Ctrl</Kbd> nupu all hoidmine.
                        </HelpText>

                        <HelpText icon={ShiftLeftIcons.get(ShiftMode.VOICES)}>
                            Nihuta kõiki noote ja eraldajaid vasakule. Vajalik <Kbd>Shift</Kbd> nupu all hoidmine.
                        </HelpText>

                        <HelpText icon={ShiftRightIcons.get(ShiftMode.VOICES)}>
                            Nihuta kõiki noote ja eraldajaid paremale. Vajalik <Kbd>Shift</Kbd> nupu all hoidmine.
                        </HelpText>

                        <HelpText icon={<FaDeleteLeft size={Size.icon.SM}/>}>
                            Eemalda valitud noot.
                        </HelpText>

                        <Divider my={"md"}/>

                        <HelpText icon={<IoMdUndo size={Size.icon.SM}/>}>
                            Võta tagasi.
                        </HelpText>

                        <HelpText icon={<IoMdRedo size={Size.icon.SM}/>}>
                            Tee uuesti.
                        </HelpText>

                        <HelpText icon={<FaRegTrashAlt size={Size.icon.XS}/>}>
                            Kustuta noodistus ja alusta uuesti.
                        </HelpText>
                    </Tabs.Panel>
                </Tabs>
            </Drawer>
        </Box>
    );
}

export default Help;
