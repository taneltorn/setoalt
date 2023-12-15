import React from 'react';
import {useScoreContext} from "../../context/ScoreContext";
import {Voices} from "../../utils/dictionaries";
import {Voice} from "../../models/Voice";
import {Button, Group, Menu} from "@mantine/core";
import {PiSpeakerSimpleHigh} from "react-icons/pi";
import ControlButton from "../common/ControlButton.tsx";
import {GiGClef} from "react-icons/gi";
import {useTranslation} from "react-i18next";
import {DialogType, useDialogContext} from "../../context/DialogContext.tsx";

const VoicePanel: React.FC = () => {

    const {t} = useTranslation();
    const context = useScoreContext();
    const {open} = useDialogContext();

    const changeVoice = (voice: Voice) => {
        context.setCurrentVoice(voice);

        const note = context.getNote(context.currentPosition, voice);
        context.setCurrentNote(note);
        context.refresh();
    }

    return (
        <Group gap={4}>
            <ControlButton
                tooltip={t("tooltip.staveSelection")}
                label={<GiGClef size={34}/>}
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

export default VoicePanel;
