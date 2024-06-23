import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {Text} from "@mantine/core";
import {DialogType, useDialogContext} from "../../../../../context/DialogContext.tsx";
import {Playback} from "../../../../../utils/constants.ts";
import Dialog from "../../../../../components/dialog/Dialog.tsx";
import {useAudioContext} from "../../../../../context/AudioContext.tsx";
import {useScoreContext} from "../../../../../context/ScoreContext.tsx";
import Slider from "../../../../../components/controls/Slider.tsx";

const ChangeTempoDialog: React.FC = () => {

    const [t] = useTranslation();
    const {close} = useDialogContext();
    const audioContext = useAudioContext();
    const scoreContext = useScoreContext();
    const [tempo, setTempo] = useState<number>(audioContext.tempo);

    const handleSave = () => {
        audioContext.setTempo(tempo);
        close();
    }

    const handleClose = () => {
        setTempo(audioContext.tempo);
        close();
    }

    useEffect(() => {
        if (scoreContext.score.defaultTempo) {
            setTempo(scoreContext.score.defaultTempo)
        }
    }, [scoreContext.score.defaultTempo]);

    return (
        <Dialog
            type={DialogType.CHANGE_TEMPO}
            title={t("dialog.changeTempo.title")}
            primaryButtonLabel={t("button.save")}
            secondaryButtonLabel={t("button.cancel")}
            onPrimaryButtonClick={handleSave}
            onSecondaryButtonClick={handleClose}
            onClose={handleClose}
        >
            <Text mb={"xl"}>
                {t("dialog.changeTempo.description")}
            </Text>

            <Slider
                min={Playback.MIN_TEMPO}
                max={Playback.MAX_TEMPO}
                step={Playback.TEMPO_SLIDER_STEP}
                defaultValue={scoreContext.score.defaultTempo || Playback.DEFAULT_TEMPO}
                value={tempo}
                label={t("unit.bpm")}
                onChange={v => setTempo(v)}
                onReset={() => setTempo(scoreContext.score.defaultTempo || Playback.DEFAULT_TEMPO)}
            />
        </Dialog>
    )
};

export default ChangeTempoDialog;
