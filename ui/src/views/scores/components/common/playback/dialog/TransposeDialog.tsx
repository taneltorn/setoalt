import React, {useState} from 'react';
import {useScoreContext} from "../../../../../../context/ScoreContext.tsx";
import Dialog from "../../../../../../components/dialog/Dialog.tsx";
import {DialogType, useDialogContext} from "../../../../../../context/DialogContext.tsx";
import {Playback} from "../../../../../../utils/constants.ts";
import {useTranslation} from "react-i18next";
import {rem, Slider, Text} from "@mantine/core";

const TransposeDialog: React.FC = () => {

    const [t] = useTranslation();
    const context = useScoreContext();
    const {close} = useDialogContext();
    const [semitones, setSemitones] = useState<number>(context.semitones);

    const handleSave = () => {
        context.setSemitones(semitones);
        close();
    }

    const handleClose = () => {
        setSemitones(context.semitones);
        close();
    }

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
            onTertiaryButtonClick={() => setSemitones(0)}
            onClose={handleClose}
        >
            <Text mb={"xl"}>
                {t("dialog.transpose.description", {pitch: t(`pitch.${context.currentNote?.pitch}`)})}
            </Text>

            <Slider
                mb={"xl"}
                thumbChildren={`${semitones > 0 ? "+" : ""}${semitones}`}
                color="black"
                label={null}
                min={Playback.MIN_TRANSPOSE}
                max={Playback.MAX_TRANSPOSE}
                step={Playback.TRANSPOSE_SLIDER_STEP}
                defaultValue={semitones}
                value={semitones}
                thumbSize={40}
                onChange={v => setSemitones(+v)}
                styles={{thumb: {borderWidth: rem(2), padding: rem(11)}}}
            />
        </Dialog>
    )
};

export default TransposeDialog;
