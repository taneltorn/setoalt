import React from 'react';
import {useScoreContext} from "../../../../../context/ScoreContext.tsx";
import {useTranslation} from "react-i18next";
import {RiIncreaseDecreaseFill} from "react-icons/ri";
import {DialogType, useDialogContext} from "../../../../../context/DialogContext.tsx";
import {ShortKey} from "../../../../../utils/keymap.ts";
import {Group, Text} from "@mantine/core";
import ControlButton from "../../../../../components/controls/ControlButton.tsx";
import {Size} from "../../../../../utils/constants.ts";

const NotePitchControls: React.FC = () => {

    const [t] = useTranslation();
    const context = useScoreContext();
    const dialogContext = useDialogContext();
    const pitches = context.score.data.stave.lines.map(l => l.pitch).reverse();

    const handleClick = (pitch: string) => {
        context.insertOrUpdateNote(pitch, context.activePosition);
    }

    return (
        <Group gap={2}>
            {pitches.map((pitch, index) =>
                <ControlButton
                    key={pitch}
                    active={context.activeNote?.pitch === pitch}
                    tooltip={t(`tooltip.${context.activeNote ? "changePitch" : "insertPitch"}`, {pitch: t(`pitch.${pitch}`)})}
                    shortKey={`${index + 1}`}
                    onClick={() => handleClick(pitch)}
                >
                    <Text fw={"bold"}>{t(`pitch.${pitch.toLowerCase()}`)}</Text>
                </ControlButton>)}

            <ControlButton
                disabled={!context.activeNote}
                tooltip={t("tooltip.microTuning")}
                shortKey={ShortKey.MICRO_TUNING}
                active={!!context.activeNote?.detune}
                onClick={() => dialogContext.open(DialogType.MICRO_TUNING)}
            >
                <RiIncreaseDecreaseFill size={Size.icon.SM}/>
            </ControlButton>
        </Group>
    )
};

export default NotePitchControls;
