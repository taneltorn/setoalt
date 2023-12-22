import React from 'react';
import {useScoreContext} from "../../../context/ScoreContext";
import {useTranslation} from "react-i18next";
import {RiIncreaseDecreaseFill} from "react-icons/ri";
import {DialogType, useDialogContext} from "../../../context/DialogContext";
import {ShortKey} from "../../../utils/keymap";
import {Group} from "@mantine/core";
import ControlButton from "../../common/ControlButton.tsx";

const NoteControls: React.FC = () => {

    const [t] = useTranslation();
    const context = useScoreContext();

    const dialogContext = useDialogContext();

    const pitches = context.score.data.stave.lines.map(l => l.pitch).reverse();

    const handleClick = (pitch: string) => {
        if (context.currentNote) {
            context.changePitch(pitch);
            return;
        }
        context.addNote(pitch);
    }

    return (
        <Group gap={4} ml={"lg"}>
            <ControlButton
                disabled={!context.currentNote}
                tooltip={t("tooltip.microTuning")}
                label={<RiIncreaseDecreaseFill size={24}/>}
                shortKey={ShortKey.MICRO_TUNING}
                active={!!context.currentNote?.detune || !!context.score.data.stave.lines.find(l => l.pitch === context.currentNote?.pitch)?.detune}
                onClick={() => dialogContext.open(DialogType.MICRO_TUNING)}
            />
            {pitches.map((pitch, index) =>
                <ControlButton
                    key={pitch}
                    active={context.currentNote?.pitch === pitch}
                    label={`${index +1}`}
                    // label={t(`pitch.${pitch.toLowerCase()}`)}
                    tooltip={t(`tooltip.${context.currentNote ? "changePitch" : "insertPitch"}`, {pitch: t(`pitch.${pitch}`)})}
                    shortKey={`${index + 1}`}
                    onClick={() => handleClick(pitch)}
                />)}
        </Group>
    )
};

export default NoteControls;
