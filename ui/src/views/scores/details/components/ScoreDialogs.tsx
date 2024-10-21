import React from "react";
import SaveVoiceDialog from "../../editor/components/dialog/SaveVoiceDialog.tsx";
import StaveSelectionDialog from "../../editor/components/dialog/StaveSelectionDialog.tsx";
import MicroTuningDialog from "../../editor/components/dialog/MicroTuningDialog.tsx";
import ResetScoreDialog from "../../editor/components/dialog/ResetScoreDialog.tsx";
import SaveScoreDialog from "../../editor/components/dialog/SaveScoreDialog.tsx";
import ChangeTranspositionDialog from "./dialog/ChangeTranspositionDialog.tsx";
import ChangeTempoDialog from "./dialog/ChangeTempoDialog.tsx";
import EmbedScoreDialog from "../../embed/components/EmbedScoreDialog.tsx";

const ScoreDialogs: React.FC = () => {

    return (
        <>
            <StaveSelectionDialog/>
            <MicroTuningDialog/>
            <ResetScoreDialog/>
            <SaveScoreDialog/>
            <ChangeTranspositionDialog/>
            <ChangeTempoDialog/>
            <SaveVoiceDialog/>
            <EmbedScoreDialog/>
        </>
    );
}

export default ScoreDialogs;
