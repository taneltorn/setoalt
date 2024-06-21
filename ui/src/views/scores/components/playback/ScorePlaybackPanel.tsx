import React from 'react';
import PlaybackControls from "./controls/PlaybackControls.tsx";
import {Group} from "@mantine/core";
import ActiveNotes from "./controls/ActiveNotes.tsx";

const ScorePlaybackPanel: React.FC = () => {

    return (
        <Group gap={"xl"}>
            <PlaybackControls/>
            <ActiveNotes/>
        </Group>
    );
};

export default ScorePlaybackPanel;
