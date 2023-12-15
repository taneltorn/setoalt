import React, {useMemo, useState} from 'react';
import {useScoreContext} from "../../context/ScoreContext";
import Dialog from "./Dialog";
import {DialogType, useDialogContext} from "../../context/DialogContext";
import {Playback} from "../../utils/constants";
import {useTranslation} from "react-i18next";
import {NoteRange} from "../../utils/dictionaries";
import {Flex, rem, Slider, Text} from "@mantine/core";

const TransposeDialog: React.FC = () => {

    const [t] = useTranslation();
    const context = useScoreContext();
    const {close} = useDialogContext();
    const [semitones, setSemitones] = useState<number>(0);

    const handleSave = () => {
        context.transpose(semitones);
        close();
    }

    const handleClose = () => {
        close();
        setSemitones(0);
    }

    const pitches: string[] = useMemo<string[]>(() => {
        const pitches: string[] = context.score.stave.lines.map(l => l.pitch);
        if (semitones !== 0) {
            pitches.forEach((pitch, index) => {
                const noteIndex = NoteRange.findIndex(n => n === pitch);
                if (noteIndex !== undefined) {
                    pitches[index] = NoteRange[noteIndex + semitones];
                }
            });
        }
        return pitches.reverse();
    }, [context.score.stave, semitones]);


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

                <Text fw={600} my={"md"}>
                    {pitches.map(p => t(`pitch.${p?.toLowerCase()}`)).join(" - ")}
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

            {/*<Row>*/}
            {/*    <Col className={"d-flex justify-content-center"}>*/}
            {/*        <span style={{fontWeight: 600, fontSize: 18}}>{pitches.map(p => t(`pitch.${p?.toLowerCase()}`)).join(" - ")}</span>*/}
            {/*    </Col>*/}
            {/*</Row>*/}
            {/*<Row>*/}
            {/*    <Col className={"d-flex justify-content-center"}>*/}
            {/*        <div className={"d-flex flex-column justify-content-center"}*/}
            {/*             style={{*/}
            {/*                 width: 100,*/}
            {/*                 padding: "12px 16px"*/}
            {/*             }}>*/}
            {/*            <span className={"d-flex justify-content-center"}*/}
            {/*                  style={{*/}
            {/*                      fontSize: 48,*/}
            {/*                      fontWeight: 500,*/}
            {/*                      color: Color.accent.PRIMARY*/}
            {/*                  }}>{semitones > 0 ? "+" : ""}{semitones}</span>*/}
            {/*            <div className={"d-flex text-uppercase justify-content-center"}>*/}
            {/*                {t("dialog.transpose.units")}*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </Col>*/}
            {/*</Row>*/}
            {/*<Row>*/}
            {/*    <Col>*/}
            {/*        <Slider*/}
            {/*            min={Playback.MIN_TRANSPOSE}*/}
            {/*            max={Playback.MAX_TRANSPOSE}*/}
            {/*            value={semitones}*/}
            {/*            step={Playback.TRANSPOSE_SLIDER_STEP}*/}
            {/*            onChange={v => setSemitones(+v)}*/}
            {/*        />*/}
            {/*    </Col>*/}
            {/*</Row>*/}

        </Dialog>
    )
};

export default TransposeDialog;
