import React from 'react';
import {DurationToShortKey} from "../../../../../utils/mapping.ts";
import {useScoreContext} from "../../../../../hooks/useScoreContext.tsx";
import {Durations} from "../../../../../utils/dictionaries.ts";
import {useTranslation} from "react-i18next";
import {Group} from "@mantine/core";
import ControlButton from "../../../../../components/controls/ControlButton.tsx";
import Icon from "@mdi/react";
import {NoteIcons} from "../../../../../utils/icons.tsx";
import {mdiMusicNoteQuarter} from "@mdi/js";
import {MdOutlineCallSplit} from "react-icons/md";
import {Size} from "../../../../../utils/constants.ts";
import {NoteFactory} from "../../../../../utils/factories.ts";
import {useNoteControls} from "../../../../../hooks/useNoteControls.tsx";

const DurationControls: React.FC = () => {

    const [t] = useTranslation();
    const {
        activeNote,
        activePosition,
        activeDuration,
        activeVoice,
        getNote,
        activate
    } = useScoreContext();
    const {changeDuration, insertNote, removeNote} = useNoteControls();

    const handleNoteSplit = () => {
        if (activeNote) {
            if (activeNote.duration === "8n") {
                changeDuration("16n", activeNote, false);
                if (activeNote) {

                }
                const note = NoteFactory.create(activeNote.pitch, activeNote.position + 0.5, "16");
                insertNote(note);
                return;
            }
            if (activeNote.duration === "16n") {
                if (activeNote.position * 10 % 10 === 5) {
                    const position = activeNote.position - 0.5;
                    const note = getNote(activeNote.position - 0.5, activeVoice);
                    changeDuration("8n", note, false);
                    removeNote(activePosition, false);
                    activate(position);

                } else {
                    removeNote(activePosition + 0.5, false);
                    changeDuration("8n", activeNote, false);
                }
            }
        }
    }

    return (
        <Group gap={4}>
            {Durations.map(duration =>
                <ControlButton
                    key={duration}
                    active={activeNote?.duration !== "16n" && activeDuration === duration}
                    disabled={activeNote?.duration === "16n"}
                    tooltip={t(`tooltip.changeDuration.${duration}`)}
                    shortKey={DurationToShortKey.get(duration)}
                    onClick={() => changeDuration(duration, activeNote, true)}
                >
                    <Icon path={NoteIcons.get(duration) || mdiMusicNoteQuarter} size={1}/>
                </ControlButton>)}

            <ControlButton
                className={"me-1"}
                active={activeNote?.duration === "16n"}
                disabled={!["8n", "16n"].includes(activeNote?.duration as string)}
                tooltip={t("tooltip.splitNote")}
                onClick={handleNoteSplit}
            >
                <MdOutlineCallSplit size={Size.icon.XS}/>
            </ControlButton>
        </Group>
    )
};

export default DurationControls;
