import {Text, Title} from "@mantine/core";
import React from "react";
import {EmptyScore} from "../utils/helpers.ts";
import {StavePPT} from "../staves/StavePPT.ts";
import Stave from "../components/stave/Stave.tsx";
import EditorPanel from "../components/editor/EditorPanel.tsx";
import {useTranslation} from "react-i18next";
import KeyPressHandler from "../components/KeyPressHandler.tsx";
import EditorDialogs from "../components/editor/EditorDialogs.tsx";
import PlaybackPanel from "../components/controls/PlaybackPanel.tsx";
import TransposeDialog from "../components/dialog/TransposeDialog.tsx";
import ScoreContextProvider from "../context/ScoreContextProvider.tsx";

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

            <Stave score={{...EmptyScore, stave: StavePPT}} showCursor/>

            <EditorDialogs/>
            <TransposeDialog/>
        </ScoreContextProvider>
    );
}

export default Editor;
