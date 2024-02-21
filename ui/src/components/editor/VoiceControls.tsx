import React from 'react';
import {useScoreContext} from "../../context/ScoreContext.tsx";
import {Voices} from "../../utils/dictionaries.ts";
import {Voice} from "../../models/Voice.ts";
import {Button, Group, Menu} from "@mantine/core";
import {PiSpeakerSimpleHigh} from "react-icons/pi";
import ControlButton from "../common/ControlButton.tsx";
import {GiGClef} from "react-icons/gi";
import {useTranslation} from "react-i18next";
import {DialogType, useDialogContext} from "../../context/DialogContext.tsx";

const VoiceControls: React.FC = () => {

    const {t} = useTranslation();
    const context = useScoreContext();
    const {open} = useDialogContext();

    const changeVoice = (voice: Voice) => {
        context.setCurrentVoice(voice);

        const note = context.getNote(context.currentPosition, voice);
        context.setCurrentNote(note);
        context.score.data.voices.forEach(v => {
            v.options = v.options || {};
            v.options.hidden = v.name !== voice.name;
        });
        context.refresh();
    }

    return (
        <Group gap={4}>
            <ControlButton
                tooltip={t("tooltip.staveSelection")}
                label={<GiGClef size={30}/>}
                onClick={() => open(DialogType.STAVE_SELECTION)}
            />
            <Menu shadow={"md"} position={"bottom-start"}>
                <Menu.Target>
                    <Button
                        color={"black"}
                        data-active={"true"}
                        leftSection={<PiSpeakerSimpleHigh/>}>
                        {context.currentVoice.name}
                    </Button>
                </Menu.Target>
                <Menu.Dropdown miw={150}>
                    {Voices.map(voice =>
                        <Menu.Item key={voice.name} onClick={() => changeVoice(voice)}>
                            {voice.name}
                        </Menu.Item>)}
                </Menu.Dropdown>
            </Menu>
        </Group>
    )
};

export default VoiceControls;
