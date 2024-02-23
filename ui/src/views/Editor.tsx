import {Button, Group, Text, Title} from "@mantine/core";
import React from "react";
import Stave from "../components/stave/Stave.tsx";
import {useTranslation} from "react-i18next";
import KeyPressHandler from "../components/KeyPressHandler.tsx";
import PlaybackPanel from "../components/playback/PlaybackPanel.tsx";
import ScoreContextProvider from "../context/ScoreContextProvider.tsx";
import ScoreInfo from "../components/ScoreInfo.tsx";
import {DialogType, useDialogContext} from "../context/DialogContext.tsx";
import {useDevMode} from "../context/DevModeContext.tsx";
import {useAuth} from "../context/AuthContext.tsx";
import Page from "../Page.tsx";
import EditorDialogs from "./EditorDialogs.tsx";

const Editor: React.FC = () => {

    const {t} = useTranslation();
    const {open} = useDialogContext();
    const {isDevMode} = useDevMode();
    const auth = useAuth();

    return (
        <ScoreContextProvider>
            <Page title={t("view.editor.title")}>
                <KeyPressHandler/>

                <Group justify={"space-between"}>
                    <Title order={1} mb={"xs"}>{t("view.editor.title")}</Title>

                    {auth.currentUser?.isAuthorized &&
                        <Button size={"md"}
                                justify={"end"}
                                onClick={() => open(DialogType.SAVE_SCORE)}>
                            {t("button.save")}
                        </Button>}
                </Group>
                <Text mb={"lg"}>{t("view.editor.description")}</Text>

                <PlaybackPanel/>
                <Stave isEditMode/>

                {isDevMode && <ScoreInfo/>}

                <EditorDialogs/>
            </Page>
        </ScoreContextProvider>
    );
}

export default Editor;
