import React from 'react';
import PlaybackControls from "./controls/PlaybackControls.tsx";
import {Group} from "@mantine/core";

const ScorePlaybackPanel: React.FC = () => {

    return (
        <Group gap={"md"}>
            <PlaybackControls/>
        </Group>
    );
};

export default ScorePlaybackPanel;
