import React from 'react';
import {useScoreContext} from "../../../../../context/ScoreContext.tsx";
import {useTranslation} from "react-i18next";
import {ShortKey} from "../../../../../utils/keymap.ts";
import {Group} from "@mantine/core";
import ControlButton from "../../../../../components/controls/ControlButton.tsx";
import {NoteType} from "../../../../../models/Note.ts";
import {mdiCodeParentheses} from "@mdi/js";
import Icon from "@mdi/react";
import {MdOutlineCallSplit} from "react-icons/md";

const NoteTypeControls: React.FC = () => {

    const [t] = useTranslation();
    const context = useScoreContext();

    const handleTypeChange = () => {
        if (!context.activeNote) {
            return;
        }
        if (context.activeNote.type === NoteType.SMALL) {
            context.changeType(context.activeNote, undefined);
            return;
        }
        context.changeType(context.activeNote, NoteType.SMALL);
    }

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
            <ControlButton
                className={"me-1"}
                active={context.activeNote?.duration === "16n"}
                disabled={!["8n", "16n"].includes(context.activeNote?.duration as string)}
                label={<MdOutlineCallSplit/>}
                tooltip={t("tooltip.splitNote")}
                onClick={handleNoteSplit}
            />
            <ControlButton
                disabled={!context.activeNote}
                tooltip={t("tooltip.changeType")}
                label={<Icon path={mdiCodeParentheses} size={0.7}/>}
                shortKey={ShortKey.CHANGE_TYPE}
                active={context.activeNote?.type === NoteType.SMALL}
                onClick={handleTypeChange}
            />
        </Group>
    )
};

export default NoteTypeControls;
