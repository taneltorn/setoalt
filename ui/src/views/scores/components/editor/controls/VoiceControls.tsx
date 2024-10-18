import React from 'react';
import {useScoreContext} from "../../../../../hooks/useScoreContext.tsx";
import {Button, Group} from "@mantine/core";
import VoiceFilterButton from "../../../../../components/controls/VoiceFilterButton.tsx";
import {MdRecordVoiceOver} from "react-icons/md";
import {useDialogContext} from "../../../../../hooks/useDialogContext.tsx";
import {useTranslation} from "react-i18next";
import {FaEdit, FaPlus} from "react-icons/fa";
import {DefaultVoices} from "../../../../../utils/dictionaries.ts";
import {FaRegTrashCan} from "react-icons/fa6";
import {Voice} from "../../../../../model/Voice.ts";
import {Size} from "../../../../../utils/constants.ts";
import {useHistory} from "../../../../../hooks/useHistory.tsx";
import {DialogType} from "../../../../../utils/enums.ts";

const VoiceControls: React.FC = () => {

    const {t} = useTranslation();
    const context = useScoreContext();
    const history = useHistory();
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

    const handleVoiceSave = (voice: Voice) => {
        changeVoice(voice.name);
        close();
    }

    const handleVoiceRemove = (name: string) => {
        history.snapshot(context);

        context.score.data.voices = context.score.data.voices
            .filter(v => v.name !== name);

        if (context.score.data.voices[0]) {
            changeVoice(context.score.data.voices[0].name);
        }
        context.refresh();
        close();
    }

    return (
        <Group justify={"space-between"} my={"md"}>
            <Group gap={4}>
                {context.score.data.voices.map(voice => (
                    <VoiceFilterButton
                        key={voice.name}
                        active={voice.name === context.activeVoice}
                        halfActive={!voice.hidden}
                        label={voice.name}
                        onClick={(e) => handleChange(e, voice.name)}
                    />))}

                <Button
                    size={"xs"}
                    color={"blue"}
                    leftSection={<FaPlus/>}
                    variant={"subtle"}
                    onClick={() => open(DialogType.SAVE_VOICE, {
                        onConfirm: handleVoiceSave
                    })}>
                    {t("button.addNew")}
                </Button>
            </Group>
            <Group gap={4}>
                {context.score.data.voices.some(v => v.hidden)
                    ?
                    <Button
                        size={"xs"}
                        color={"blue"}
                        leftSection={<MdRecordVoiceOver size={Size.icon.XS}/>}
                        variant={"subtle"}
                        onClick={showAllVoices}
                    >
                        {t("button.showAll")}
                    </Button>
                    :
                    <Button
                        size={"xs"}
                        color={"blue"}
                        leftSection={<MdRecordVoiceOver size={Size.icon.XS}/>}
                        variant={"subtle"}
                        onClick={showActiveVoice}
                    >
                        {t("button.showActive")}
                    </Button>}

                {!DefaultVoices.map(v => v.name).includes(context.activeVoice) && <>
                    <Button
                        size={"xs"}
                        color={"blue"}
                        leftSection={<FaEdit size={Size.icon.XS}/>}
                        variant={"subtle"}
                        onClick={() => open(DialogType.SAVE_VOICE, {
                            voice: context.score.data.voices.find(v => v.name === context.activeVoice),
                            onConfirm: handleVoiceSave
                        })}
                    >
                        {t("button.changeVoice")}
                    </Button>
                    <Button
                        size={"xs"}
                        color={"red"}
                        leftSection={<FaRegTrashCan size={Size.icon.XS}/>}
                        variant={"subtle"}
                        onClick={() => handleVoiceRemove(context.activeVoice)}
                    >
                        {t("button.removeVoice")}
                    </Button>
                </>}
            </Group>
        </Group>

    );
};

export default VoiceControls;
