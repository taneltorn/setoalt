import React from 'react';
import {useScoreContext} from "../../../../../context/ScoreContext.tsx";
import {Button, Grid, Group} from "@mantine/core";
import FilterButton from "../../../../../components/controls/FilterButton.tsx";
import {MdRecordVoiceOver} from "react-icons/md";
import {DialogType, useDialogContext} from "../../../../../context/DialogContext.tsx";
import {useTranslation} from "react-i18next";
import {FaPlus} from "react-icons/fa";
import {DefaultVoices} from "../../../../../utils/dictionaries.ts";
import {FaRegTrashCan} from "react-icons/fa6";
import {Voice} from "../../../../../model/Voice.ts";

const VoiceControls: React.FC = () => {

    const {t} = useTranslation();
    const context = useScoreContext();
    const {open, close} = useDialogContext();

    const showAllVoices = () => {
        context.score.data.voices.forEach(v => {
            v.hidden = false;
        })
        context.refresh();
    }

    const showActiveVoice = () => {
        context.score.data.voices.forEach(v => {
            v.hidden = v.name !== context.activeVoice;
        })
        context.refresh();
    }

    const changeVoice = (name: string) => {
        context.setActiveVoice(name);
        context.score.data.voices.forEach(v => {
            v.hidden = v.name !== name;
        });
        context.refresh();
    }

    const handleChange = (event: any, name: string) => {
        if (event.ctrlKey) {
            const voice = context.score.data.voices.find(v => v.name === name);
            if (voice && voice.name !== context.activeVoice) {
                voice.hidden = !voice.hidden;
                context.refresh();
            }
            return;
        }
        context.setActiveVoice(name);
        context.score.data.voices.forEach(v => {
            v.hidden = v.name !== name;
        });
        context.refresh();
    }

    const handleVoiceAdd = (voice: Voice) => {
        changeVoice(voice.name);
        close();
    }

    const handleVoiceRemove = (name: string) => {
        context.score.data.voices = context.score.data.voices
            .filter(v => v.name !== name);

        if (context.score.data.voices[0]) {
            changeVoice(context.score.data.voices[0].name);
        }
        context.refresh();
        close();
    }

    return (
        <Grid mt={"md"}>
            <Grid.Col span={9}>
                <Group gap={4}>
                    {context.score.data.voices.map(voice => (
                        <FilterButton
                            key={voice.name}
                            active={!voice.hidden}
                            color={voice.name === context.activeVoice ? "black" : "gray.6"}
                            label={voice.name}
                            onClick={(e) => handleChange(e, voice.name)}
                        />))}

                    <Button
                        size={"xs"}
                        color={"blue"}
                        leftSection={<FaPlus/>}
                        variant={"subtle"}
                        onClick={() => open(DialogType.ADD_VOICE, {
                            voices: context.score.data.voices,
                            onConfirm: handleVoiceAdd
                        })}>
                        {t("button.addNew")}
                    </Button>
                </Group>
            </Grid.Col>
            <Grid.Col span={3}>
                <Group gap={4} justify={"end"}>

                    {context.score.data.voices.some(v => v.hidden)
                        ?
                        <Button
                            size={"xs"}
                            color={"blue"}
                            leftSection={<MdRecordVoiceOver size={20}/>}
                            variant={"subtle"}
                            onClick={showAllVoices}
                        >
                            {t("button.showAll")}
                        </Button>
                        :
                        <Button
                            size={"xs"}
                            color={"blue"}
                            leftSection={<MdRecordVoiceOver size={20}/>}
                            variant={"subtle"}
                            onClick={showActiveVoice}
                        >
                            {t("button.showActive")}
                        </Button>}

                    {!DefaultVoices.map(v => v.name).includes(context.activeVoice) &&
                        <Button
                            size={"xs"}
                            color={"red"}
                            leftSection={<FaRegTrashCan size={20}/>}
                            variant={"subtle"}
                            onClick={() => open(DialogType.REMOVE_VOICE, {
                                name: context.activeVoice,
                                onRemove: () => handleVoiceRemove(context.activeVoice)
                            })}
                        >
                            {t("button.removeVoice")}
                        </Button>}
                </Group>
            </Grid.Col>
        </Grid>

    );
};

export default VoiceControls;
