import React from "react";
import {useTranslation} from "react-i18next";
import {DialogType, useDialogContext} from "../../../context/DialogContext.tsx";
import Page from "../../../Page.tsx";
import ScoreEditorPanel from "./editor/ScoreEditorPanel.tsx";
import VoiceControls from "./editor/controls/VoiceControls.tsx";
import ScoreControls from "./editor/controls/ScoreControls.tsx";
import Header from "../../../components/controls/Header.tsx";
import ScorePlaybackPanel from "./playback/ScorePlaybackPanel.tsx";
import Stave from "./stave/Stave.tsx";
import {useAudioContext} from "../../../context/AudioContext.tsx";
import {Group} from "@mantine/core";
import ScoreSettings, {Setting} from "./ScoreSettings.tsx";

const Editor: React.FC = () => {

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
                    primaryButtonVariant={"outline"}
                    primaryButtonRequiresAuth
                    hideSecondaryButton
                />
            }>
                {t("view.editor.title")}
            </Header>

            <Group justify={"space-between"}>
                <ScorePlaybackPanel/>
                <ScoreSettings settings={[Setting.CHANGE_MODE, Setting.EXPORT_PNG]}/>
            </Group>

            <VoiceControls/>
            <ScoreEditorPanel/>

            <Stave isEditMode/>
        </Page>
    )
        ;
}

export default Editor;
