import {Button, Group, Title} from "@mantine/core";
import React from "react";
import Stave from "../components/stave/Stave.tsx";
import {useTranslation} from "react-i18next";
import KeyPressHandler from "../components/KeyPressHandler.tsx";
import PlaybackPanel from "../components/playback/PlaybackPanel.tsx";
import TransposeDialog from "../components/dialog/TransposeDialog.tsx";
import ScoreContextProvider from "../context/ScoreContextProvider.tsx";
import StaveSelectionDialog from "../components/dialog/StaveSelectionDialog.tsx";
import MicroTuningDialog from "../components/dialog/MicroTuningDialog.tsx";
import ResetScoreDialog from "../components/dialog/ResetScoreDialog.tsx";
import ScoreInfo from "../components/ScoreInfo.tsx";
import SaveScoreDialog from "../components/dialog/SaveScoreDialog.tsx";
import {DialogType, useDialogContext} from "../context/DialogContext.tsx";
import {useDevMode} from "../context/DevModeContext.tsx";
import {useAuth} from "../context/AuthContext.tsx";

const Editor: React.FC = () => {

    const {t} = useTranslation();
    const {open} = useDialogContext();
    const {isDevMode} = useDevMode();
    const auth = useAuth();

    return (
        <ScoreContextProvider showEditor>
            <KeyPressHandler/>

            <Group justify={"space-between"} mb={"xs"}>
                <Title order={1} mb={"xs"}>
                    {t("view.editor.title")}
                </Title>

                {auth.currentUser?.isAuthorized &&
                    <Button size={"md"} justify={"end"} onClick={() => open(DialogType.SAVE_SCORE)}>
                        {t("button.save")}
                    </Button>}
            </Group>

            <PlaybackPanel/>
            <Stave isEditMode/>

            <StaveSelectionDialog/>
            <MicroTuningDialog/>
            <ResetScoreDialog/>
            <SaveScoreDialog/>
            <TransposeDialog/>

            {isDevMode && <ScoreInfo/>}
        </ScoreContextProvider>
    );
}

export default Editor;
