import React, {useEffect, useState} from 'react';
import {useScoreContext} from "../../../../../context/ScoreContext.tsx";
import {useAudioContext} from "../../../../../context/AudioContext.tsx";
import Dialog from "../../../../../components/dialog/Dialog.tsx";
import {DialogType, useDialogContext} from "../../../../../context/DialogContext.tsx";
import {Playback} from "../../../../../utils/constants.ts";
import {useTranslation} from "react-i18next";
import {rem, Slider, Text} from "@mantine/core";

const MicroTuningDialog: React.FC = () => {

    const [t] = useTranslation();
    const context = useScoreContext();
    const {close} = useDialogContext();
    const {playNotes} = useAudioContext();
    const [detune, setDetune] = useState<number>(context.activeNote?.detune || 0);

    const handleSave = () => {
        if (context.activeNote) {
            context.takeSnapshot();
            context.activeNote.detune = detune;
            playNotes([context.activeNote], context.score.data.stave);
            context.refresh();
        }
        close();
    }

    const handleClose = () => {
        close();
        setDetune(context.activeNote?.detune || 0);
    }

    useEffect(() => {
        setDetune(context.activeNote?.detune || 0);
    }, [context.activeNote]);

    return (
        <Dialog
            type={DialogType.MICRO_TUNING}
            title={t("dialog.microTuning.title")}
            primaryButtonLabel={t("button.save")}
            secondaryButtonLabel={t("button.cancel")}
            tertiaryButtonLabel={t("button.reset")}
            showTertiaryButton
            onPrimaryButtonClick={handleSave}
            onSecondaryButtonClick={handleClose}
            onTertiaryButtonClick={() => setDetune(0)}
            onClose={handleClose}
        >
            <Text mb={"xl"}>
                {t("dialog.microTuning.description", {pitch: t(`pitch.${context.activeNote?.pitch}`)})}
            </Text>

            <Slider
                miw={400}
                mb={"xl"}
                thumbChildren={`${detune > 0 ? "+" : ""}${detune}`}
                color="black"
                label={null}
                min={Playback.MIN_DETUNE}
                max={Playback.MAX_DETUNE}
                step={Playback.DETUNE_SLIDER_STEP}
                defaultValue={detune}
                value={detune}
                thumbSize={40}
                onChange={v => setDetune(+v)}
                styles={{thumb: {borderWidth: rem(2), padding: rem(11)}}}
            />
        </Dialog>
    )
};

export default MicroTuningDialog;
