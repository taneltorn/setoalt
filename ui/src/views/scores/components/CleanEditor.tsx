import React from "react";
import {useTranslation} from "react-i18next";
import {DialogType, useDialogContext} from "../../../context/DialogContext.tsx";
import Page from "../../../Page.tsx";
import ScoreEditorPanel from "./editor/ScoreEditorPanel.tsx";
import VoiceControls from "./editor/controls/VoiceControls.tsx";
import ScoreControls from "./editor/controls/ScoreControls.tsx";
import Header from "../../../components/controls/Header.tsx";
import Description from "../../../components/controls/Description.tsx";
import ScorePlaybackPanel from "./playback/ScorePlaybackPanel.tsx";
import Stave from "./stave/Stave.tsx";
import {Group} from "@mantine/core";

const CleanEditor: React.FC = () => {

    const {t} = useTranslation();
    const {open} = useDialogContext();

    return (
        <Page title={t("view.editor.title")}>
            <Group justify={"space-between"}>
                <Header text={t("view.editor.title")}/>
                <ScoreControls
                    onPrimaryButtonClick={() => open(DialogType.SAVE_SCORE)}
                    primaryButtonRequiresAuth
                    hideSecondaryButton
                />
            </Group>

            <Description text={t("view.editor.description")}/>

            <ScorePlaybackPanel/>

            <VoiceControls/>
            <ScoreEditorPanel/>

            <Stave isEditMode/>
        </Page>
    )
        ;
}

export default CleanEditor;
