import React from 'react';
import NoteControls from "./controls/NoteControls.tsx";
import DurationPanel from "./DurationPanel";
import LayoutPanel from "./LayoutPanel";
import {Group} from "@mantine/core";
import MiscPanel from "./MiscPanel.tsx";
import classes from "./EditorPanel.module.scss";
import VoicePanel from "./VoicePanel.tsx";

const EditorPanel: React.FC = () => {

    return (
        <Group className={classes.panel}>

            <VoicePanel/>
            <NoteControls/>
            <DurationPanel/>
            <LayoutPanel/>
            <MiscPanel/>

            {/*<div className={"hover-pointer hover-color-accent d-flex justify-content-end flex-grow-1"}*/}
            {/*     onClick={() => open(DialogType.STAVE_SELECTION)}>*/}
            {/*    <GiGClef size={40}/>*/}
            {/*</div>*/}
        </Group>
    )
};

export default EditorPanel;
