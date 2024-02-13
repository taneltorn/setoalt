import {Button, Group, Text, Title} from "@mantine/core";
import React from "react";
import Stave from "../components/stave/Stave.tsx";
import {useTranslation} from "react-i18next";
import KeyPressHandler from "../components/KeyPressHandler.tsx";
import PlaybackPanel from "../components/controls/PlaybackPanel.tsx";
import TransposeDialog from "../components/dialog/TransposeDialog.tsx";
import ScoreContextProvider from "../context/ScoreContextProvider.tsx";
import StaveSelectionDialog from "../components/dialog/StaveSelectionDialog.tsx";
import MicroTuningDialog from "../components/dialog/MicroTuningDialog.tsx";
import ResetScoreDialog from "../components/dialog/ResetScoreDialog.tsx";
import ScoreInfo from "../components/ScoreInfo.tsx";
import SaveScoreDialog from "../components/dialog/SaveScoreDialog.tsx";
import {DialogType, useDialogContext} from "../context/DialogContext.tsx";
import {useDevMode} from "../context/DevModeContext.tsx";

const Editor: React.FC = () => {

    const {t} = useTranslation();
    const {open} = useDialogContext();
    const {isDevMode} = useDevMode();

    return (
        <ScoreContextProvider showEditor>
            <KeyPressHandler/>

            <Group justify={"space-between"}>
                <Title order={1} mb={"xs"}>
                    {t("view.editor.title")}
                </Title>

                <Button size={"md"} justify={"end"} onClick={() => open(DialogType.SAVE_SCORE)}>
                    {t("button.save")}
                </Button>
            </Group>

            <Text>{t("view.editor.description")} </Text>
            <Text mb={"lg"} fw={600}>NB! Hetkel salvestamisvõimalus puudub.</Text>

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
