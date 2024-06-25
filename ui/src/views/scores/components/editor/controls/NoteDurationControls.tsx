import React from 'react';
import {DurationToShortKey} from "../../../../../utils/mapping.ts";
import {useScoreContext} from "../../../../../context/ScoreContext.tsx";
import {Durations} from "../../../../../utils/dictionaries.ts";
import {useTranslation} from "react-i18next";
import {Group} from "@mantine/core";
import ControlButton from "../../../../../components/controls/ControlButton.tsx";
import Icon from "@mdi/react";
import {NoteIcons} from "../../../../../utils/icons.tsx";
import {mdiMusicNoteQuarter} from "@mdi/js";
import {MdOutlineCallSplit} from "react-icons/md";
import {Size} from "../../../../../utils/constants.ts";

const NoteDurationControls: React.FC = () => {

    const [t] = useTranslation();
    const context = useScoreContext();

    const handleNoteSplit = () => {
        if (context.activeNote) {
            if (context.activeNote.duration === "8n") {
                context.changeNoteDuration("16n", undefined, true);
                context.insertOrUpdateNote(context.activeNote.pitch, context.activeNote.position + 0.5, "16n");
                return;
            }
            if (context.activeNote.duration === "16n") {
                if (context.activeNote.position * 10 % 10 === 5) {
                    const p = context.activeNote.position - 0.5;
                    context.changeNoteDuration("8n", context.activeNote.position - 0.5, true);
                    context.removeNote(context.activePosition, false);
                    context.activate(p);

                } else {
                    context.removeNote(context.activePosition + 0.5, false);
                    context.changeNoteDuration("8n", undefined, true);
                }
            }
        }
    }

    return (
        <Group gap={4}>
            {Durations.map(duration =>
                <ControlButton
                    key={duration}
                    active={context.activeNote ? context.activeNote.duration === duration : context.activeDuration === duration}
                    disabled={context.activeNote?.duration === "16n"}
                    tooltip={t(`tooltip.changeNoteDuration.${duration}`)}
                    shortKey={DurationToShortKey.get(duration)}
                    onClick={() => context.setActiveDuration(duration)}
                >
                    <Icon path={NoteIcons.get(duration) || mdiMusicNoteQuarter} size={1}/>
                </ControlButton>)}

            <ControlButton
                className={"me-1"}
                active={context.activeNote?.duration === "16n"}
                disabled={!["8n", "16n"].includes(context.activeNote?.duration as string)}
                tooltip={t("tooltip.splitNote")}
                onClick={handleNoteSplit}
            >
                <MdOutlineCallSplit size={Size.icon.XS}/>
            </ControlButton>
        </Group>
    )
};

export default NoteDurationControls;
