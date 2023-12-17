import React, {useState} from 'react';
import {useScoreContext} from "../../context/ScoreContext";
import Dialog from "./Dialog";
import {DialogType, useDialogContext} from "../../context/DialogContext";
import {Playback} from "../../utils/constants";
import {useTranslation} from "react-i18next";
import {Flex, rem, Slider, Text} from "@mantine/core";
import TextLink from "../common/TextLink.tsx";

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
            onPrimaryButtonClick={handleSave}
            onSecondaryButtonClick={handleClose}
            onClose={handleClose}
        >
            <Flex direction={"column"}>
                <Text>
                    {t("dialog.transpose.description", {pitch: t(`pitch.${context.currentNote?.pitch}`)})}
                </Text>

                <Text>
                    <TextLink to={"#"} label={t("button.reset")} onClick={() => setSemitones(0)}/>
                </Text>

                <Slider
                    miw={400}
                    mt={"lg"}
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
            </Flex>
        </Dialog>
    )
};

export default TransposeDialog;
