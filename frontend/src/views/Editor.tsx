import {Alert, Text, Title} from "@mantine/core";
import {useScoreContext} from "../context/ScoreContext.tsx";
import React, {useEffect} from "react";
import {EmptyScore} from "../utils/helpers.ts";
import {StavePPT} from "../staves/StavePPT.ts";
import Stave from "../components/stave/Stave.tsx";
import EditorPanel from "../components/editor/EditorPanel.tsx";
import {useTranslation} from "react-i18next";
import KeyPressHandler from "../components/KeyPressHandler.tsx";
import EditorDialogs from "../components/editor/EditorDialogs.tsx";
import PlaybackPanel from "../components/controls/PlaybackPanel.tsx";
import TransposeDialog from "../components/dialog/TransposeDialog.tsx";
import {IoMdAlert} from "react-icons/io";

const Editor: React.FC = () => {

    const {t} = useTranslation();
    const context = useScoreContext();


    useEffect(() => {
        context.setScore({...EmptyScore, stave: StavePPT});
        context.setIsEditMode(true);
    }, []);

    return (
        <>
            <KeyPressHandler/>

            <Title order={2} mb={"xs"}>{t("view.editor.title")}</Title>
            <Text mb={"lg"}>{t("view.editor.description")}</Text>

            <Alert mb={"md"} radius={"md"} icon={<IoMdAlert size={30}/>}>
                Hetkel salvestamise võimalus puudub.
            </Alert>

            <PlaybackPanel/>
            <EditorPanel/>

            <Stave score={context.score}/>

            <EditorDialogs/>
            <TransposeDialog/>
        </>
    );
}

export default Editor;
