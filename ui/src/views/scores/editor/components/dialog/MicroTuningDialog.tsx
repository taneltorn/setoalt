import React, {useEffect, useState} from 'react';
import {useScoreContext} from "../../../../../hooks/useScoreContext.tsx";
import {useAudioContext} from "../../../../../hooks/useAudioContext.tsx";
import Dialog from "../../../../../components/dialog/Dialog.tsx";
import {useDialogContext} from "../../../../../hooks/useDialogContext.tsx";
import {Playback} from "../../../../../utils/constants.ts";
import {useTranslation} from "react-i18next";
import {Switch, Text} from "@mantine/core";
import Slider from "../../../../../components/controls/Slider.tsx";
import {useHistory} from "../../../../../hooks/useHistory.tsx";
import {DialogType} from "../../../../../utils/enums.ts";

const MicroTuningDialog: React.FC = () => {

    const [t] = useTranslation();
    const context = useScoreContext();
    const history = useHistory();
    const {close} = useDialogContext();
    const {playNotes} = useAudioContext();
    const [detune, setDetune] = useState<number>(context.activeNote?.detune || 0);
    const [showDetuneIndicator, setShowDetuneIndicator] = useState<boolean>(context.activeNote?.showDetuneIndicator !== false);

    const handleSave = () => {
        if (context.activeNote) {
            history.snapshot(context);
            context.activeNote.detune = detune;
            context.activeNote.showDetuneIndicator = showDetuneIndicator;
            playNotes([context.activeNote], context.score.data.stave);
            context.refresh();
        }
        close();
    }

    const handleClose = () => {
        close();
        setDetune(context.activeNote?.detune || 0);
    }

    const handleReset = () => {
        setDetune(0);
        setShowDetuneIndicator(true);
    }

    useEffect(() => {
        setDetune(context.activeNote?.detune || 0);
        setShowDetuneIndicator(context.activeNote?.showDetuneIndicator  !== false)
    }, [context.activeNote]);

    return (
        <Dialog
            type={DialogType.MICRO_TUNING}
            size={"lg"}
            title={t("dialog.microTuning.title")}
            primaryButtonLabel={t("button.save")}
            secondaryButtonLabel={t("button.cancel")}
            onPrimaryButtonClick={handleSave}
            onSecondaryButtonClick={handleClose}
            onClose={handleClose}
        >
            <Text size={"xl"} mb={"xl"}>
                {t("dialog.microTuning.description", {pitch: t(`pitch.${context.activeNote?.pitch}`)})}
            </Text>

            <Slider
                min={Playback.MIN_DETUNE}
                max={Playback.MAX_DETUNE}
                step={Playback.TRANSPOSITION_STEP}
                defaultValue={Playback.DETUNE_STEP}
                isRelative
                value={detune}
                label={t("unit.cents")}
                onChange={v => setDetune(v)}
                onReset={handleReset}
            />

            <Switch
                size={"lg"}
                className={"hover-pointer"}
                checked={showDetuneIndicator}
                label={t(`dialog.microTuning.showDetuneIndicator`)}
                onChange={() => setShowDetuneIndicator(!showDetuneIndicator)}
            />
        </Dialog>
    )
};

export default MicroTuningDialog;
