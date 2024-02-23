import React from 'react';
import PlaybackControls from "./PlaybackControls.tsx";
import {Group} from "@mantine/core";
import TempoSlider from "./TempoSlider.tsx";
import VoiceFilter from "./VoiceFilter.tsx";
import ExportControls from "./ExportControls.tsx";

const PlaybackPanel: React.FC = () => {

    return (
        <Group justify={"space-between"} mb={"md"} >
            <Group gap={"xl"}>
                <PlaybackControls/>
                <TempoSlider/>
                <VoiceFilter/>
            </Group>
            <Group>
                <ExportControls/>
            </Group>
        </Group>
    );
};

export default PlaybackPanel;
