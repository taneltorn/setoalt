import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {Text} from "@mantine/core";
import {useDialogContext} from "../../../../../hooks/useDialogContext.tsx";
import {Playback} from "../../../../../utils/constants.ts";
import Dialog from "../../../../../components/dialog/Dialog.tsx";
import {useAudioContext} from "../../../../../hooks/useAudioContext.tsx";
import {useScoreContext} from "../../../../../hooks/useScoreContext.tsx";
import Slider from "../../../../../components/controls/Slider.tsx";
import {DialogType} from "../../../../../utils/enums.ts";

const ChangeTempoDialog: React.FC = () => {

    const [t] = useTranslation();
    const {close} = useDialogContext();
    const audioContext = useAudioContext();
    const scoreContext = useScoreContext();
    const [tempo, setTempo] = useState<number>(scoreContext.score.defaultTempo || Playback.DEFAULT_TEMPO);

    const handleSave = () => {
        audioContext.setTempo(tempo);
        close();
    }

    const handleClose = () => {
        setTempo(audioContext.tempo);
        close();
    }

    useEffect(() => {
        setTempo(scoreContext.score.defaultTempo || Playback.DEFAULT_TEMPO);
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
            <Text size={"xl"} mb={"xl"}>
                {t("dialog.changeTempo.description")}
            </Text>

            <Slider
                min={Math.max(Playback.MIN_TEMPO, (scoreContext.score.defaultTempo || Playback.DEFAULT_TEMPO) * (1 - Playback.ALLOWED_TEMPO_CHANGE))}
                max={Math.min(Playback.MAX_TEMPO, (scoreContext.score.defaultTempo || Playback.DEFAULT_TEMPO) * (Playback.ALLOWED_TEMPO_CHANGE + 1))}
                step={Playback.TEMPO_STEP}
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
