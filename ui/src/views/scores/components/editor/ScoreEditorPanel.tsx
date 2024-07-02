import React from 'react';
import PitchControls from "./controls/PitchControls.tsx";
import DurationControls from "./controls/DurationControls.tsx";
import LayoutControls from "./controls/LayoutControls.tsx";
import {Group} from "@mantine/core";
import HistoryControls from "./controls/HistoryControls.tsx";
import {Layout} from "../../../../utils/constants.ts";
import NoteTypeControls from "./controls/NoteTypeControls.tsx";
import StaveControls from "./controls/StaveControls.tsx";

const ScoreEditorPanel: React.FC = () => {

    return (
        <Group gap={"xl"} my={"sm"} py={"xs"} px={"xs"} bg={"gray.1"}
               style={{maxWidth: Layout.stave.container.MAX_WIDTH}}>
            <StaveControls/>
            <PitchControls/>
            <DurationControls/>
            <NoteTypeControls/>
            <LayoutControls/>
            <HistoryControls/>
        </Group>
    )
};

export default ScoreEditorPanel;
