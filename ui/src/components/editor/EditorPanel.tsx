import React from 'react';
import NoteControls from "./controls/NoteControls.tsx";
import DurationControls from "./controls/DurationControls.tsx";
import LayoutControls from "./controls/LayoutControls.tsx";
import {Group} from "@mantine/core";
import MiscControls from "./controls/MiscControls.tsx";
import classes from "./EditorPanel.module.scss";
import VoiceControls from "./controls/VoiceControls.tsx";

const EditorPanel: React.FC = () => {

    return (
        <Group className={classes.panel}>
            <VoiceControls/>
            <NoteControls/>
            <DurationControls/>
            <LayoutControls/>
            <MiscControls/>
        </Group>
    )
};

export default EditorPanel;
