import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {rem, Slider, Text} from "@mantine/core";
import {DialogType, useDialogContext} from "../../../../../context/DialogContext.tsx";
import {Playback} from "../../../../../utils/constants.ts";
import Dialog from "../../../../../components/dialog/Dialog.tsx";
import {useAudioContext} from "../../../../../context/AudioContext.tsx";
import {useScoreContext} from "../../../../../context/ScoreContext.tsx";

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
            tertiaryButtonLabel={t("button.reset")}
            showTertiaryButton
            onPrimaryButtonClick={handleSave}
            onSecondaryButtonClick={handleClose}
            onTertiaryButtonClick={() => setTempo(Playback.DEFAULT_TEMPO)}
            onClose={handleClose}
        >
            <Text mb={"xl"}>
                {t("dialog.changeTempo.description")}
            </Text>

            <Slider
                mb={"xl"}
                thumbChildren={tempo}
                color="black"
                label={null}
                min={Playback.MIN_TEMPO}
                max={Playback.MAX_TEMPO}
                step={Playback.TEMPO_SLIDER_STEP}
                defaultValue={Playback.DEFAULT_TEMPO}
                value={tempo}
                thumbSize={40}
                onChange={v => setTempo(+v)}
                styles={{thumb: {borderWidth: rem(2), padding: rem(11)}}}
            />
        </Dialog>
    )
};

export default ChangeTempoDialog;
