import React from 'react';
import MicroTuningDialog from "../dialog/MicroTuningDialog.tsx";
import StaveSelectionDialog from "../dialog/StaveSelectionDialog.tsx";
import ResetScoreDialog from "../dialog/ResetScoreDialog.tsx";

const EditorDialogs: React.FC = () => {


    return (
        <>
            <StaveSelectionDialog/>
            <MicroTuningDialog/>
            <ResetScoreDialog/>
        </>
    )
};

export default EditorDialogs;
