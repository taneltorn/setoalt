import React from 'react';
import {Voice} from "../../models/Voice";
import {useScoreContext} from "../../context/ScoreContext";
import {Group} from "@mantine/core";
import VoiceFilterButton from "./VoiceFilterButton.tsx";

const VoiceFilter: React.FC = () => {

    const context = useScoreContext();

    const toggleVoice = (voice: Voice) => {
        const v = context.score.data.voices.find(v => v.name === voice.name);
        if (!v) {
            return;
        }
        v.hidden = !v.hidden;
        context.refresh();
    }

    const toggleShowAll = () => {
        const allVoicesVisible = context.score.data.voices.every(v => !v.hidden);
        context.score.data.voices.forEach(v => {
            v.hidden = allVoicesVisible
                ? v.name !== context.currentVoice.name
                : false;
        });
        context.refresh();
    }

    return (
        <Group gap={4} ml={"xl"}>
            {!context.isEditMode && context.score.data.voices.map(voice => (
                <VoiceFilterButton
                    key={voice.name}
                    active={!voice.hidden}
                    label={voice.name}
                    onClick={() => toggleVoice(voice)}
                />
            ))}

            {context.isEditMode &&
                <VoiceFilterButton
                    active={context.score.data.voices.every(v => !v.hidden)}
                    label={"Näita kõiki"} // todo
                    onClick={toggleShowAll}
                />}
        </Group>
    );
};

export default VoiceFilter;
