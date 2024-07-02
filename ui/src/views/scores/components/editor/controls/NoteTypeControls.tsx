import React from 'react';
import {useScoreContext} from "../../../../../hooks/useScoreContext.tsx";
import {useTranslation} from "react-i18next";
import {ShortKey} from "../../../../../utils/keymap.ts";
import {Group} from "@mantine/core";
import ControlButton from "../../../../../components/controls/ControlButton.tsx";
import {NoteType} from "../../../../../model/Note.ts";
import {Size} from "../../../../../utils/constants.ts";
import {RiParenthesesLine} from "react-icons/ri";
import {useNoteControls} from "../../../../../hooks/useNoteControls.tsx";

const NoteTypeControls: React.FC = () => {

    const [t] = useTranslation();
    const {activeNote} = useScoreContext();
    const {changeType} = useNoteControls();

    const handleTypeChange = () => {
        if (!activeNote) {
            return;
        }
        if (activeNote.type === NoteType.SMALL) {
            changeType(activeNote, NoteType.REGULAR);
            return;
        }
        changeType(activeNote, NoteType.SMALL);
    }

    return (
        <Group gap={4}>
            <ControlButton
                disabled={!activeNote}
                tooltip={t("tooltip.changeType")}
                shortKey={ShortKey.CHANGE_TYPE}
                active={activeNote?.type === NoteType.SMALL}
                onClick={handleTypeChange}
            >
                <RiParenthesesLine size={Size.icon.XS} />
            </ControlButton>
        </Group>
    )
};

export default NoteTypeControls;
