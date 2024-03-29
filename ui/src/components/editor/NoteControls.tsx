import React from 'react';
import {useScoreContext} from "../../context/ScoreContext.tsx";
import {useTranslation} from "react-i18next";
import {ShortKey} from "../../utils/keymap.ts";
import {Group} from "@mantine/core";
import ControlButton from "../common/ControlButton.tsx";
import {NoteType} from "../../models/Note.ts";
import {mdiCodeParentheses} from "@mdi/js";
import Icon from "@mdi/react";

const NoteControls: React.FC = () => {

    const [t] = useTranslation();
    const context = useScoreContext();

    const handleTypeChange = () => {
        if (!context.currentNote) {
            return;
        }
        if (context.currentNote.type === NoteType.SMALL) {
            context.changeType(context.currentNote, undefined);
            return;
        }
        context.changeType(context.currentNote, NoteType.SMALL);
    }

    return (
        <Group gap={4} ml={"sm"}>
            <ControlButton
                disabled={!context.currentNote}
                tooltip={t("tooltip.changeType")}
                label={<Icon path={mdiCodeParentheses} size={0.7}/>}
                shortKey={ShortKey.CHANGE_TYPE}
                active={context.currentNote?.type === NoteType.SMALL}
                onClick={handleTypeChange}
            />
        </Group>
    )
};

export default NoteControls;
