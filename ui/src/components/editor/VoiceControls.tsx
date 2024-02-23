import React, {useEffect, useState} from 'react';
import {useScoreContext} from "../../context/ScoreContext.tsx";
import {DefaultVoices} from "../../utils/dictionaries.ts";
import {Voice} from "../../models/Voice.ts";
import {Button, Divider, Group, Menu, Text} from "@mantine/core";
import {PiSpeakerSimpleHigh} from "react-icons/pi";
import ControlButton from "../common/ControlButton.tsx";
import {GiGClef} from "react-icons/gi";
import {useTranslation} from "react-i18next";
import {DialogType, useDialogContext} from "../../context/DialogContext.tsx";
import {FaRegTrashCan} from "react-icons/fa6";

const VoiceControls: React.FC = () => {

    const {t} = useTranslation();
    const context = useScoreContext();
    const {open, close} = useDialogContext();
    const [voices, setVoices] = useState<Voice[]>([]);

    const changeVoice = (voice: Voice) => {
        context.setCurrentVoice(voice);

        const note = context.getNote(context.currentPosition, voice);
        context.setCurrentNote(note);
        context.score.data.voices.forEach(v => {
            v.hidden = v.name !== voice.name;
        });
        context.refresh();
    }

    const refreshVoices = () => {
        const defaultVoices = DefaultVoices.map(v => v.name) || [];
        const otherVoices = context.score.data.voices
            .filter(v => !defaultVoices.includes(v.name));
        setVoices([...DefaultVoices, ...otherVoices]);
    }

    const handleVoiceAdd = (voice: Voice) => {
        changeVoice(voice);
        refreshVoices();
        close();
    }

    const handleVoiceRemove = (voice: Voice) => {
        context.score.data.voices = context.score.data.voices
            .filter(v => v.name !== voice.name);

        if (context.score.data.voices[0]) {
            changeVoice(context.score.data.voices[0]);
        }
        refreshVoices();
        close();
    }

    useEffect(() => {
        refreshVoices();
    }, []);

    return (
        <Group gap={4}>
            <ControlButton
                tooltip={t("tooltip.staveSelection")}
                label={<GiGClef size={30}/>}
                onClick={() => open(DialogType.STAVE_SELECTION)}
            />
            <Menu shadow={"md"} position={"bottom-start"} radius={"lg"}>
                <Menu.Target>
                    <Button
                        color={"black"}
                        data-active={"true"}
                        leftSection={<PiSpeakerSimpleHigh/>}>
                        {context.currentVoice.name}
                    </Button>
                </Menu.Target>
                <Menu.Dropdown miw={200} style={{zIndex: 5}}>
                    {voices.map(voice =>
                        <Menu.Item key={voice.name} onClick={() => changeVoice(voice)}>
                            <Group justify={"space-between"}>
                                <Text fw={"bold"}>{voice.name}</Text>

                                {!DefaultVoices.map(v => v.name).includes(voice.name) && <FaRegTrashCan
                                    size={20}
                                    className={"hover-pointer"}
                                    title={t("button.remove")}
                                    color={"gray.6"}
                                    onClick={() => open(DialogType.REMOVE_VOICE, {
                                        name: voice.name,
                                        onRemove: () => handleVoiceRemove(voice)
                                    })}
                                />}
                            </Group>
                        </Menu.Item>)}

                    <Divider my="xs" />

                    <Group justify={"center"} grow>

                        <Button
                            variant={"subtle"} onClick={() => open(DialogType.ADD_VOICE, {
                            voices: voices,
                            onConfirm: handleVoiceAdd
                        })}>
                            {t("button.addNew")}
                        </Button>
                    </Group>

                </Menu.Dropdown>
            </Menu>
        </Group>
    )
};

export default VoiceControls;
