import React from 'react';
import {Voice} from "../../../../../models/Voice.ts";
import {useScoreContext} from "../../../../../context/ScoreContext.tsx";
import {Button, Grid, Group} from "@mantine/core";
import FilterButton from "../../../../../components/controls/FilterButton.tsx";
import {MdRecordVoiceOver} from "react-icons/md";
import {DialogType, useDialogContext} from "../../../../../context/DialogContext.tsx";
import {useTranslation} from "react-i18next";
import {FaPlus} from "react-icons/fa";
import {DefaultVoices} from "../../../../../utils/dictionaries.ts";
import {FaRegTrashCan} from "react-icons/fa6";

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

    const changeVoice = (voice: Voice) => {
        context.setCurrentVoice(voice);

        const note = context.getNote(context.currentPosition, voice);
        context.setCurrentNote(note);
        context.score.data.voices.forEach(v => {
            v.hidden = v.name !== voice.name;
        });
        context.refresh();
    }

    const handleVoiceAdd = (voice: Voice) => {
        changeVoice(voice);
        close();
    }

    const handleVoiceRemove = (voice: Voice) => {
        context.score.data.voices = context.score.data.voices
            .filter(v => v.name !== voice.name);

        if (context.score.data.voices[0]) {
            changeVoice(context.score.data.voices[0]);
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
                            active={context.isEditMode ? voice.name === context.currentVoice.name : !voice.hidden}
                            label={voice.name}
                            onClick={() => changeVoice(voice)}
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

                    {context.score.data.voices.some(v => v.hidden) &&
                        <Button
                            size={"xs"}
                            color={"blue"}
                            leftSection={<MdRecordVoiceOver size={20}/>}
                            variant={"subtle"}
                            onClick={showAllVoices}
                        >
                            {t("button.showAll")}
                        </Button>}
                    {!DefaultVoices.map(v => v.name).includes(context.currentVoice.name) &&
                        <Button
                            size={"xs"}
                            color={"red"}
                            leftSection={<FaRegTrashCan size={20}/>}
                            variant={"subtle"}
                            onClick={() => open(DialogType.REMOVE_VOICE, {
                                name: context.currentVoice.name,
                                onRemove: () => handleVoiceRemove(context.currentVoice)
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
