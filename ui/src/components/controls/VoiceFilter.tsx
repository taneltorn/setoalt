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
        v.options = v.options || {};
        v.options.hidden = !v.options.hidden;
        context.refresh();
    }

    const toggleShowAll = () => {
        const allVoicesVisible = context.score.data.voices.every(v => !v.options?.hidden);
        context.score.data.voices.forEach(v => {
            v.options = v.options || {};
            v.options.hidden = allVoicesVisible
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
                    active={!voice.options?.hidden}
                    // active={context.filter.voices === undefined || !!context.filter.voices?.includes(voice.name)}
                    label={voice.name}
                    onClick={() => toggleVoice(voice)}
                />
            ))}

            {context.isEditMode &&
                <VoiceFilterButton
                    active={context.score.data.voices.every(v => !v.options?.hidden)}
                    label={"Näita kõiki"}
                    onClick={toggleShowAll}
                />}
        </Group>
    );
};

export default VoiceFilter;
