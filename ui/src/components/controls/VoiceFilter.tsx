import React from 'react';
import {Voice} from "../../models/Voice";
import {MdRecordVoiceOver, MdVoiceOverOff} from "react-icons/md";
import {useTranslation} from "react-i18next";
import {useScoreContext} from "../../context/ScoreContext";
import {Button, Group} from "@mantine/core";

const VoiceFilter: React.FC = () => {

    const {t} = useTranslation();
    const context = useScoreContext();

    const ICON_SIZE = 20;

    const toggleVoice = (voice: Voice) => {
        const score = {...context.score};
        if (voice) {
            const value = !voice.hidden;
            voice.hidden = value;

            voice.notes.forEach(note => {
                note.hidden = value;
            })
        }
        context.setScore(score);
    }

    return (
        <Group gap={4} ml={"xl"}>
            {context.score.data.voices.map(voice => (
                <Button
                    key={voice.name}
                    c={voice.hidden ? "gray.5" : "white"}
                    color={voice.hidden ? "gray.1" : "black"}
                    title={t(`tooltip.${!voice.hidden ? "hideVoice" : "showVoice"}`)}
                    className={`me-2`}
                    leftSection={!voice.hidden
                        ? <MdRecordVoiceOver
                            size={ICON_SIZE}
                            style={{color: "white"}}
                        />
                        : <MdVoiceOverOff
                            size={ICON_SIZE}
                            style={{color: "#ccc"}}
                        />}
                    onClick={() => toggleVoice(voice)}
                >
                    {voice.name}
                </Button>))}
        </Group>
    );
};

export default VoiceFilter;
