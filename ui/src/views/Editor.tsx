import {Text, Title} from "@mantine/core";
import React from "react";
import Stave from "../components/stave/Stave.tsx";
import EditorPanel from "../components/editor/EditorPanel.tsx";
import {useTranslation} from "react-i18next";
import KeyPressHandler from "../components/KeyPressHandler.tsx";
import PlaybackPanel from "../components/controls/PlaybackPanel.tsx";
import TransposeDialog from "../components/dialog/TransposeDialog.tsx";
import ScoreContextProvider from "../context/ScoreContextProvider.tsx";
import StaveSelectionDialog from "../components/dialog/StaveSelectionDialog.tsx";
import MicroTuningDialog from "../components/dialog/MicroTuningDialog.tsx";
import ResetScoreDialog from "../components/dialog/ResetScoreDialog.tsx";
import ScoreInfo from "../components/ScoreInfo.tsx";

const Editor: React.FC = () => {

    const {t} = useTranslation();

    return (
        <ScoreContextProvider showEditor>
            <KeyPressHandler/>

            <Title order={1} mb={"xs"}>{t("view.editor.title")}</Title>
            <Text>{t("view.editor.description")} </Text>
            <Text mb={"lg"} fw={600}>NB! Hetkel salvestamisvõimalus puudub.</Text>

            <PlaybackPanel/>
            <EditorPanel/>

            <Stave/>

            <StaveSelectionDialog/>
            <MicroTuningDialog/>
            <ResetScoreDialog/>
            <TransposeDialog/>

            <ScoreInfo/>
        </ScoreContextProvider>
    );
}

export default Editor;
