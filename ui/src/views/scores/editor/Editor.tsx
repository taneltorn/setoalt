import React from "react";
import {useTranslation} from "react-i18next";
import {useDialogContext} from "../../../hooks/useDialogContext.tsx";
import Page from "../../../Page.tsx";
import ScoreEditorPanel from "./components/ScoreEditorPanel.tsx";
import VoiceControls from "./components/controls/VoiceControls.tsx";
import ScoreControls from "./components/controls/ScoreControls.tsx";
import Header from "../../../components/controls/Header.tsx";
import Stave from "../details/components/stave/Stave.tsx";
import {useAudioContext} from "../../../hooks/useAudioContext.tsx";
import {Group} from "@mantine/core";
import ScoreSettings, {Setting} from "../details/components/ScoreSettings.tsx";
import {DialogType} from "../../../utils/enums.ts";
import PlaybackControls from "../details/components/playback/PlaybackControls.tsx";

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
                <PlaybackControls/>
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
