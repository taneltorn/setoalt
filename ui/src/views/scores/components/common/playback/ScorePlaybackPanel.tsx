import React from 'react';
import PlaybackControls from "./controls/PlaybackControls.tsx";
import {Group} from "@mantine/core";
import TempoControls from "./controls/TempoControls.tsx";

const ScorePlaybackPanel: React.FC = () => {

    return (
        <Group my={"md"}>
            <PlaybackControls/>
            <TempoControls/>
        </Group>
    );
};

export default ScorePlaybackPanel;
