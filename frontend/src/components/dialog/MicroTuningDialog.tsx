import React, {useEffect, useState} from 'react';
import {useScoreContext} from "../../context/ScoreContext";
import {useAudioContext} from "../../context/AudioContext";
import Dialog from "./Dialog";
import {DialogType, useDialogContext} from "../../context/DialogContext";
import {Playback} from "../../utils/constants";
import {useTranslation} from "react-i18next";
import {Flex, rem, Slider, Text} from "@mantine/core";

const MicroTuningDialog: React.FC = () => {

    const [t] = useTranslation();
    const context = useScoreContext();
    const {close} = useDialogContext();
    const {playNote} = useAudioContext();
    const [detune, setDetune] = useState<number>(context.currentNote?.detune || 0);

    const handleSave = () => {
        if (context.currentNote) {
            context.currentNote.detune = detune;
            playNote(context.currentNote, context.currentVoice, undefined);
            context.refresh();
        }
        close();
    }

    const handleClose = () => {
        close();
        setDetune(context.currentNote?.detune || 0);
    }

    useEffect(() => {
        setDetune(context.currentNote?.detune || 0);
    }, [context.currentNote]);

    return (
        <Dialog
            type={DialogType.MICRO_TUNING}
            title={t("dialog.microTuning.title")}
            primaryButtonLabel={t("button.save")}
            secondaryButtonLabel={t("button.cancel")}
            onPrimaryButtonClick={handleSave}
            onSecondaryButtonClick={handleClose}
            onClose={handleClose}
        >
            <Flex direction={"column"}>
                <Text>
                    {t("dialog.microTuning.description", {pitch: t(`pitch.${context.currentNote?.pitch}`)})}
                </Text>
                <Slider
                    miw={400}
                    mt={"lg"}
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
            </Flex>
        </Dialog>
    )
};

export default MicroTuningDialog;
