import React from "react";
import AddVoiceDialog from "../editor/dialog/AddVoiceDialog.tsx";
import RemoveVoiceDialog from "../editor/dialog/RemoveVoiceDialog.tsx";
import StaveSelectionDialog from "../editor/dialog/StaveSelectionDialog.tsx";
import MicroTuningDialog from "../editor/dialog/MicroTuningDialog.tsx";
import ResetScoreDialog from "../editor/dialog/ResetScoreDialog.tsx";
import SaveScoreDialog from "../editor/dialog/SaveScoreDialog.tsx";
import TransposeDialog from "../playback/dialog/TransposeDialog.tsx";

const ScoreDialogs: React.FC = () => {

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

export default ScoreDialogs;
