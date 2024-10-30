import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {Text} from "@mantine/core";
import {useDialogContext} from "../../../../../hooks/useDialogContext.tsx";
import {useScoreContext} from "../../../../../hooks/useScoreContext.tsx";
import {Playback} from "../../../../../utils/constants.ts";
import Dialog from "../../../../../components/dialog/Dialog.tsx";
import {useAudioContext} from "../../../../../hooks/useAudioContext.tsx";
import Slider from "../../../../../components/controls/Slider.tsx";
import {DialogType} from "../../../../../utils/enums.ts";
import AdjustmentControls from "../../../../../components/controls/AdjustmentControls.tsx";

const ChangeTranspositionDialog: React.FC = () => {

    const [t] = useTranslation();
    const scoreContext = useScoreContext();
    const audioContext = useAudioContext();
    const {close} = useDialogContext();
    const [transposition, setTransposition] = useState<number>(audioContext.transposition);

    const handleSave = () => {
        audioContext.setTransposition(transposition);
        close();
    }

    const handleClose = () => {
        setTransposition(audioContext.transposition);
        close();
    }

    useEffect(() => {
        setTransposition(scoreContext.score.defaultTransposition || Playback.DEFAULT_TRANSPOSITION);
    }, [scoreContext.score.defaultTransposition]);

    return (
        <Dialog
            type={DialogType.TRANSPOSE}
            title={t("dialog.transpose.title")}
            primaryButtonLabel={t("button.save")}
            secondaryButtonLabel={t("button.cancel")}
            onPrimaryButtonClick={handleSave}
            onSecondaryButtonClick={handleClose}
            onClose={handleClose}
        >
            <Text size={"xl"} mb={"xl"}>
                {t("dialog.transpose.description", {pitch: t(`pitch.${scoreContext.activeNote?.pitch}`)})}
            </Text>

            <Slider
                min={Playback.MIN_TRANSPOSITION}
                max={Playback.MAX_TRANSPOSITION}
                step={Playback.TRANSPOSITION_STEP}
                defaultValue={scoreContext.score.defaultTransposition || Playback.DEFAULT_TRANSPOSITION}
                isRelative
                value={transposition}
                label={t("unit.semitones")}
                onChange={v => setTransposition(v)}
                onReset={() => setTransposition(scoreContext.score.defaultTransposition || Playback.DEFAULT_TRANSPOSITION)}
            />

            <AdjustmentControls
                decreaseDisabled={transposition <= Playback.MIN_TRANSPOSITION}
                increaseDisabled={transposition >= Playback.MAX_TRANSPOSITION}
                onDecrease={() => setTransposition(transposition - Playback.TRANSPOSITION_STEP)}
                onIncrease={() => setTransposition(transposition + Playback.TRANSPOSITION_STEP)}
            />
        </Dialog>
    )
};

export default ChangeTranspositionDialog;
