import React from 'react';
import {useScoreContext} from "../../../../../hooks/useScoreContext.tsx";
import {useTranslation} from "react-i18next";
import {RiIncreaseDecreaseFill} from "react-icons/ri";
import {useDialogContext} from "../../../../../hooks/useDialogContext.tsx";
import {ShortKey} from "../../../../../utils/keymap.ts";
import {Group, Text} from "@mantine/core";
import ControlButton from "../../../../../components/controls/ControlButton.tsx";
import {Size} from "../../../../../utils/constants.ts";
import {useNoteControls} from "../../../../../hooks/useNoteControls.tsx";
import {NoteFactory} from "../../../../../utils/factories.ts";
import {DialogType} from "../../../../../utils/enums.ts";

const PitchControls: React.FC = () => {

    const [t] = useTranslation();
    const {score, activeNote, activePosition, activeDuration} = useScoreContext();
    const {changePitch, insertNote} = useNoteControls();
    const dialogContext = useDialogContext();
    const pitches = score.data.stave.lines.map(l => l.pitch).reverse();

    const handlePitchChange = (pitch: string) => {
        if (activeNote) {
            changePitch(activeNote, pitch);
            return;
        }
        const note = NoteFactory.create(pitch, activePosition, activeDuration);
        insertNote(note);
    }

    return (
        <Group gap={4}>
            {pitches.map((pitch, index) =>
                <ControlButton
                    key={pitch}
                    active={activeNote?.pitch === pitch}
                    tooltip={t(`tooltip.${activeNote ? "changePitch" : "insertPitch"}`, {pitch: t(`pitch.${pitch}`)})}
                    shortKey={`${index + 1}`}
                    onClick={() => handlePitchChange(pitch)}
                >
                    <Text fw={"bold"}>{t(`pitch.${pitch.toLowerCase()}`)}</Text>
                </ControlButton>)}

            <ControlButton
                disabled={!activeNote}
                tooltip={t("tooltip.microTuning")}
                shortKey={ShortKey.MICRO_TUNING}
                active={!!activeNote?.detune}
                onClick={() => dialogContext.open(DialogType.MICRO_TUNING)}
            >
                <RiIncreaseDecreaseFill size={Size.icon.SM}/>
            </ControlButton>
        </Group>
    )
};

export default PitchControls;
