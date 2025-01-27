import React from "react";
import { Button, Group } from "@mantine/core";
import { MdRecordVoiceOver } from "react-icons/md";
import { useTranslation } from "react-i18next";
import VoiceFilterButton from "../../../../../components/controls/VoiceFilterButton.tsx";
import { useScoreContext } from "../../../../../hooks/useScoreContext.tsx";
import { Voice } from "../../../../../model/Voice.ts";
import { useAudioContext } from "../../../../../hooks/useAudioContext.tsx";
import { Size } from "../../../../../utils/constants.ts";
import { sortVoicesByOrder } from "../../../../../utils/helpers.tsx";

const VoiceFilter: React.FC = () => {
    
    const { t } = useTranslation();
    const context = useScoreContext();
    const { stopPlayback } = useAudioContext();

    const voices = context.score.data.voices;

    const showAllVoices = () => {
        voices.forEach((voice) => {
            voice.muted = false;
            voice.hidden = false;
        });
        context.refresh();
        stopPlayback();
    };

    const toggleVoiceState = (event: React.MouseEvent, voice: Voice) => {
        const targetVoice = voices.find((v) => v.name === voice.name);
        if (!targetVoice) return;

        if (event.ctrlKey) {
            if (targetVoice.hidden && targetVoice.muted) {
                targetVoice.muted = false;
            } else {
                targetVoice.hidden = !targetVoice.hidden;
            }
        } else {
            const shouldHideAndMute = !targetVoice.hidden && !targetVoice.muted;
            targetVoice.hidden = shouldHideAndMute;
            targetVoice.muted = shouldHideAndMute;
        }

        context.refresh();
        stopPlayback();
    };

    
    const getVoiceState = (voice: Voice): "active" | "semi-active" | "disabled" => {
        if (!voice.muted && !voice.hidden) return "active";
        if (!voice.muted) return "semi-active";
        return "disabled";
    };

    return (
        <Group justify="space-between" mt="md">
            <Group gap={4}>
                {sortVoicesByOrder(voices)
                    .filter((voice) => voice.notes.length > 0)
                    .map((voice) => (
                        <VoiceFilterButton
                            key={voice.name}
                            state={getVoiceState(voice)}
                            label={voice.name}
                            onClick={(e) => toggleVoiceState(e, voice)}
                        />
                    ))}
            </Group>

            {voices.some((voice) => voice.muted || voice.hidden) && (
                <Group justify="end">
                    <Button
                        size="compact-sm"
                        color="blue"
                        leftSection={<MdRecordVoiceOver size={Size.icon.XS} />}
                        variant="subtle"
                        onClick={showAllVoices}
                    >
                        {t("button.showAll")}
                    </Button>
                </Group>
            )}
        </Group>
    );
};

export default VoiceFilter;
