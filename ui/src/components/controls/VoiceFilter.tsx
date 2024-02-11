import React from 'react';
import {Voice} from "../../models/Voice";
import {useScoreContext} from "../../context/ScoreContext";
import {Group} from "@mantine/core";
import VoiceFilterButton from "./VoiceFilterButton.tsx";

const VoiceFilter: React.FC = () => {

    const context = useScoreContext();

    const toggleVoice = (voice: Voice) => {
        const voices = context.filter.voices || [];
        if (voices.includes(voice.name)) {
            context.filter.voices = voices.filter(v => v !== voice.name);
        } else {
            voices.push(voice.name);

        }
        context.setFilter({...context.filter});
        context.refresh();
    }

    const toggleShowAll = () => {
        context.setFilter({
            ...context.filter,
            voices: !!context.filter.voices?.length ? [] : [context.currentVoice.name]
        });
        context.refresh();
    }

    return (
        <Group gap={4} ml={"xl"}>
            {!context.isEditMode && context.score.data.voices.map(voice => (
                <VoiceFilterButton
                    key={voice.name}
                    active={!context.filter.voices?.length || !!context.filter.voices?.includes(voice.name)}
                    label={voice.name}
                    onClick={() => toggleVoice(voice)}
                />
            ))}

            {context.isEditMode &&
                <VoiceFilterButton
                    active={!context.filter.voices?.length || context.filter.voices?.length === context.score.data.voices.length}
                    label={"Näita kõiki"}
                    onClick={toggleShowAll}
                />}
        </Group>
    );
};

export default VoiceFilter;
