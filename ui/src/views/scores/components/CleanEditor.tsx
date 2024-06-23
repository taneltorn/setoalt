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
import {useAudioContext} from "../../../context/AudioContext.tsx";

const CleanEditor: React.FC = () => {

    const {t} = useTranslation();
    const {open} = useDialogContext();
    const {stopPlayback} = useAudioContext();

    const handleClick = () => {
        stopPlayback();
        open(DialogType.SAVE_SCORE)
    }

    return (
        <Page title={t("view.editor.title")}>
            <Header rightSection={
                <ScoreControls
                    onPrimaryButtonClick={handleClick}
                    primaryButtonRequiresAuth
                    hideSecondaryButton
                />
            }>
                {t("view.editor.title")}
            </Header>
            <Description>{t("view.editor.description")}</Description>

            <ScorePlaybackPanel/>

            <VoiceControls/>
            <ScoreEditorPanel/>

            <Stave isEditMode/>
        </Page>
    )
        ;
}

export default CleanEditor;
