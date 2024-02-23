import React from "react";
import TransposeDialog from "../components/dialog/TransposeDialog.tsx";
import AddVoiceDialog from "../components/dialog/AddVoiceDialog.tsx";
import RemoveVoiceDialog from "../components/dialog/RemoveVoiceDialog.tsx";
import StaveSelectionDialog from "../components/dialog/StaveSelectionDialog.tsx";
import MicroTuningDialog from "../components/dialog/MicroTuningDialog.tsx";
import ResetScoreDialog from "../components/dialog/ResetScoreDialog.tsx";
import SaveScoreDialog from "../components/dialog/SaveScoreDialog.tsx";

const EditorDialogs: React.FC = () => {

    return (
        <>
            <StaveSelectionDialog/>
            <MicroTuningDialog/>
            <ResetScoreDialog/>
            <RemoveVoiceDialog/>
            <SaveScoreDialog/>
            <TransposeDialog/>
            <AddVoiceDialog/>
        </>
    );
}

export default EditorDialogs;
