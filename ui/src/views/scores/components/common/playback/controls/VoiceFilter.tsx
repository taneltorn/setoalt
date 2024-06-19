import React from 'react';
import {Voice} from "../../../../../../models/Voice.ts";
import {useScoreContext} from "../../../../../../context/ScoreContext.tsx";
import {Button, Grid, Group} from "@mantine/core";
import FilterButton from "../../../../../../components/controls/FilterButton.tsx";
import {MdRecordVoiceOver} from "react-icons/md";
import {useTranslation} from "react-i18next";

const VoiceFilter: React.FC = () => {

    const {t} = useTranslation();
    const context = useScoreContext();

    const toggleVoice = (voice: Voice) => {
        const v = context.score.data.voices.find(v => v.name === voice.name);
        if (!v) {
            return;
        }
        v.hidden = !v.hidden;
        context.refresh();
    }

    const showAllVoices = () => {
        context.score.data.voices.forEach(v => {
            v.hidden = false;
        })
        context.refresh();
    }

    return (
        <Grid>
            <Grid.Col span={10}>
                <Group gap={4}>
                    {context.score.data.voices.map(voice => (
                        <FilterButton
                            key={voice.name}
                            active={context.isEditMode ? voice.name === context.currentVoice.name : !voice.hidden}
                            label={voice.name}
                            onClick={() => toggleVoice(voice)}
                        />))}

                </Group>
            </Grid.Col>

            <Grid.Col span={2}>
                <Group gap={"xs"} justify={"end"}>
                    <Button
                        size={"xs"}
                        color={"blue"}
                        leftSection={<MdRecordVoiceOver size={20}/>}
                        variant={"subtle"}
                        onClick={showAllVoices}
                    >
                        {t("button.showAll")}
                    </Button>
                </Group>
            </Grid.Col>
        </Grid>
    );
};

export default VoiceFilter;
