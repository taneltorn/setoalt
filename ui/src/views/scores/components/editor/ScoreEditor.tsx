import {Button, Group, Text, Title} from "@mantine/core";
import React from "react";
import Stave from "../common/stave/Stave.tsx";
import {useTranslation} from "react-i18next";
import KeyPressHandler from "../../../../components/KeyPressHandler.tsx";
import ScorePlaybackPanel from "../common/playback/ScorePlaybackPanel.tsx";
import ScoreDevInfo from "../ScoreDevInfo.tsx";
import {DialogType, useDialogContext} from "../../../../context/DialogContext.tsx";
import {useDevMode} from "../../../../context/DevModeContext.tsx";
import {useAuth} from "../../../../context/AuthContext.tsx";
import Page from "../../../../Page.tsx";
import ScoreDialogs from "../ScoreDialogs.tsx";
import ScoreEditorPanel from "./ScoreEditorPanel.tsx";
import PNGExport from "../common/export/PNGExport.tsx";

const ScoreEditor: React.FC = () => {

    const {t} = useTranslation();
    const {open} = useDialogContext();
    const {isDevMode} = useDevMode();
    const auth = useAuth();

    return (
        <Page title={t("view.editor.title")}>
            <Group justify={"space-between"} mb={"lg"}>
                <Title order={1}>
                    {t("view.editor.title")}
                </Title>

                <Group gap={"xs"}>
                    <PNGExport/>

                    {auth.currentUser?.isAuthorized &&
                        <Button size={"md"}
                                onClick={() => open(DialogType.SAVE_SCORE)}>
                            {t("button.save")}
                        </Button>}
                </Group>
            </Group>

            <Text mb={"lg"}>
                {t("view.editor.description")}
            </Text>

            <ScorePlaybackPanel/>
            <ScoreEditorPanel/>

            <Stave isEditMode/>

            <KeyPressHandler/>
            <ScoreDialogs/>

            {isDevMode && <ScoreDevInfo/>}
        </Page>
    );
}

export default ScoreEditor;
