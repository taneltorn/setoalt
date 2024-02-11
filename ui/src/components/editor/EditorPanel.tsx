import React from 'react';
import NoteControls from "./controls/NoteControls.tsx";
import DurationControls from "./controls/DurationControls.tsx";
import LayoutControls from "./controls/LayoutControls.tsx";
import {Button, Group} from "@mantine/core";
import MiscControls from "./controls/MiscControls.tsx";
import classes from "./EditorPanel.module.scss";
import VoiceControls from "./controls/VoiceControls.tsx";
import {useScoreContext} from "../../context/ScoreContext.tsx";
import {DialogType, useDialogContext} from "../../context/DialogContext.tsx";
import {GiGClef} from "react-icons/gi";
import {useTranslation} from "react-i18next";

const EditorPanel: React.FC = () => {

    const {t} = useTranslation();
    const context = useScoreContext();
    const {open} = useDialogContext();

    return (<>

        <Group className={classes.panel}>
            <VoiceControls/>
            <NoteControls/>
            <DurationControls/>
            <LayoutControls/>
            <MiscControls/>
        </Group>


        </>
    )
};

export default EditorPanel;
