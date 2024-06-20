import React, {useState} from 'react';
import {useTranslation} from "react-i18next";
import {rem, Slider, Text} from "@mantine/core";
import {DialogType, useDialogContext} from "../../../../../context/DialogContext.tsx";
import {useScoreContext} from "../../../../../context/ScoreContext.tsx";
import {Playback} from "../../../../../utils/constants.ts";
import Dialog from "../../../../../components/dialog/Dialog.tsx";

const TransposeDialog: React.FC = () => {

    const [t] = useTranslation();
    const context = useScoreContext();
    const {close} = useDialogContext();
    const [transposition, setTransposition] = useState<number>(context.transposition);

    const handleSave = () => {
        context.setTransposition(transposition);
        close();
    }

    const handleClose = () => {
        setTransposition(context.transposition);
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
            onTertiaryButtonClick={() => setTransposition(0)}
            onClose={handleClose}
        >
            <Text mb={"xl"}>
                {t("dialog.transpose.description", {pitch: t(`pitch.${context.activeNote?.pitch}`)})}
            </Text>

            <Slider
                mb={"xl"}
                thumbChildren={`${transposition > 0 ? "+" : ""}${transposition}`}
                color="black"
                label={null}
                min={Playback.MIN_TRANSPOSE}
                max={Playback.MAX_TRANSPOSE}
                step={Playback.TRANSPOSE_SLIDER_STEP}
                defaultValue={transposition}
                value={transposition}
                thumbSize={40}
                onChange={v => setTransposition(+v)}
                styles={{thumb: {borderWidth: rem(2), padding: rem(11)}}}
            />
        </Dialog>
    )
};

export default TransposeDialog;
