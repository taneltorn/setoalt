import React from 'react';
import {Button, Grid, Group} from "@mantine/core";
import {MdRecordVoiceOver} from "react-icons/md";
import {useTranslation} from "react-i18next";
import VoiceFilterButton from "../../../../../components/controls/VoiceFilterButton.tsx";
import {useScoreContext} from "../../../../../hooks/useScoreContext.tsx";
import {Voice} from "../../../../../model/Voice.ts";
import {useAudioContext} from "../../../../../hooks/useAudioContext.tsx";
import {Size} from "../../../../../utils/constants.ts";

const VoiceFilter: React.FC = () => {

    const {t} = useTranslation();
    const context = useScoreContext();
    const {stopPlayback} = useAudioContext();

    const toggleVoice = (voice: Voice) => {
        const v = context.score.data.voices.find(v => v.name === voice.name);
        if (!v) {
            return;
        }
        v.hidden = !v.hidden;
        context.refresh();
        stopPlayback();
    }

    const showAllVoices = () => {
        context.score.data.voices.forEach(v => {
            v.hidden = false;
        })
        context.refresh();
        stopPlayback();
    }

    return (
        <Grid mt={"md"}>
            <Grid.Col span={10}>
                <Group gap={4}>
                    {context.score.data.voices.map(voice => (
                        <VoiceFilterButton
                            key={voice.name}
                            active={context.isEditMode ? voice.name === context.activeVoice : !voice.hidden}
                            label={voice.name}
                            onClick={() => toggleVoice(voice)}
                        />))}
                </Group>
            </Grid.Col>
            <Grid.Col span={2}>
                {context.score.data.voices.some(v => v.hidden) &&
                    <Group justify={"end"}>
                        <Button
                            size={"xs"}
                            color={"blue"}
                            leftSection={<MdRecordVoiceOver size={Size.icon.XS}/>}
                            variant={"subtle"}
                            onClick={showAllVoices}
                        >
                            {t("button.showAll")}
                        </Button>
                    </Group>}
            </Grid.Col>


        </Grid>
    );
};

export default VoiceFilter;
