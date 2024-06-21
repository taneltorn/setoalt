import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {rem, Slider, Text} from "@mantine/core";
import {DialogType, useDialogContext} from "../../../../../context/DialogContext.tsx";
import {useScoreContext} from "../../../../../context/ScoreContext.tsx";
import {Playback} from "../../../../../utils/constants.ts";
import Dialog from "../../../../../components/dialog/Dialog.tsx";
import {useAudioContext} from "../../../../../context/AudioContext.tsx";

const ChangeTranspositionDialog: React.FC = () => {

    const [t] = useTranslation();
    const scoreContext = useScoreContext();
    const audioContext = useAudioContext();
    const {close} = useDialogContext();
    const [transposition, setTransposition] = useState<number>(scoreContext.transposition);

    const handleSave = () => {
        audioContext.setTransposition(transposition);
        close();
    }

    const handleClose = () => {
        setTransposition(scoreContext.transposition);
        close();
    }

    useEffect(() => {
        if (scoreContext.score.defaultTransposition) {
            setTransposition(scoreContext.score.defaultTransposition)
        }
    }, [scoreContext.score.defaultTransposition]);

    return (
        <Dialog
            type={DialogType.TRANSPOSE}
            title={t("dialog.transpose.title")}
            primaryButtonLabel={t("button.save")}
            secondaryButtonLabel={t("button.cancel")}
            tertiaryButtonLabel={t("button.reset")}
            showTertiaryButton
            onPrimaryButtonClick={handleSave}
            onSecondaryButtonClick={handleClose}
            onTertiaryButtonClick={() => setTransposition(0)}
            onClose={handleClose}
        >
            <Text mb={"xl"}>
                {t("dialog.transpose.description", {pitch: t(`pitch.${scoreContext.activeNote?.pitch}`)})}
            </Text>

            <Slider
                mb={"xl"}
                thumbChildren={`${transposition > 0 ? "+" : ""}${transposition}`}
                color="black"
                label={null}
                min={Playback.MIN_TRANSPOSE}
                max={Playback.MAX_TRANSPOSE}
                step={Playback.TRANSPOSE_SLIDER_STEP}
                defaultValue={Playback.DEFAULT_TRANSPOSITION}
                value={transposition}
                thumbSize={40}
                onChange={v => setTransposition(+v)}
                styles={{thumb: {borderWidth: rem(2), padding: rem(11)}}}
            />
        </Dialog>
    )
};

export default ChangeTranspositionDialog;
