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
import ControlPanel from "../../../components/controls/ControlPanel.tsx";

const CleanEditor: React.FC = () => {

    const {t} = useTranslation();
    const {open} = useDialogContext();

    return (
        <Page title={t("view.editor.title")}>
            <Header text={t("view.editor.title")}/>
            <Description text={t("view.editor.description")}/>

            <ControlPanel
                leftSection={<ScorePlaybackPanel/>}
                rightSection={
                    <ScoreControls
                        onPrimaryButtonClick={() => open(DialogType.SAVE_SCORE)}
                        primaryButtonRequiresAuth
                        hideSecondaryButton
                    />}
            />

            <VoiceControls/>
            <ScoreEditorPanel/>

            <Stave isEditMode/>
        </Page>
    )
        ;
}

export default CleanEditor;
