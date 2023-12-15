import React from 'react';
import PlaybackControls from "./PlaybackControls.tsx";
import {Group} from "@mantine/core";
import TempoSlider from "./TempoSlider.tsx";
import VoiceFilter from "./VoiceFilter.tsx";

const PlaybackPanel: React.FC = () => {

    return (
        <Group mb={"md"} gap={4}>
            <PlaybackControls/>
            <TempoSlider/>
            <VoiceFilter/>
        </Group>
    );
};

export default PlaybackPanel;
