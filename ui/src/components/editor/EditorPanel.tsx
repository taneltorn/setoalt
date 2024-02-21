import React from 'react';
import PitchControls from "./PitchControls.tsx";
import DurationControls from "./DurationControls.tsx";
import LayoutControls from "./LayoutControls.tsx";
import {Group} from "@mantine/core";
import ScoreControls from "./ScoreControls.tsx";
import classes from "./EditorPanel.module.scss";
import VoiceControls from "./VoiceControls.tsx";
import {Layout} from "../../utils/constants.ts";
import NoteControls from "./NoteControls.tsx";

const EditorPanel: React.FC = () => {

    return (<>
            <Group style={{maxWidth: Layout.stave.container.WIDTH}} className={classes.panel}>
                <VoiceControls/>
                <PitchControls/>
                <DurationControls/>
                <NoteControls/>
                <LayoutControls/>
                <ScoreControls/>
            </Group>
        </>
    )
};

export default EditorPanel;
