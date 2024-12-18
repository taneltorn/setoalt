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
import {DialogType, Role} from "../../../utils/enums.ts";
import PlaybackControls from "../details/components/playback/PlaybackControls.tsx";
import {useAuth} from "../../../hooks/useAuth.tsx";

const Editor: React.FC = () => {

    const {t} = useTranslation();
    const {open} = useDialogContext();
    const {stopPlayback} = useAudioContext();
    const auth = useAuth();

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
                    hidePrimaryButton={![Role.ADMIN, Role.EDITOR, Role.USER].includes(auth.currentUser?.role as Role)}
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
