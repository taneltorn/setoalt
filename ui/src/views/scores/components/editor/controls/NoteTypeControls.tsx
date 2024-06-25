import React from 'react';
import {useScoreContext} from "../../../../../context/ScoreContext.tsx";
import {useTranslation} from "react-i18next";
import {ShortKey} from "../../../../../utils/keymap.ts";
import {Group} from "@mantine/core";
import ControlButton from "../../../../../components/controls/ControlButton.tsx";
import {NoteType} from "../../../../../model/Note.ts";
import {Size} from "../../../../../utils/constants.ts";
import {RiParenthesesLine} from "react-icons/ri";

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

    return (
        <Group gap={2}>
            <ControlButton
                disabled={!context.activeNote}
                tooltip={t("tooltip.changeType")}
                shortKey={ShortKey.CHANGE_TYPE}
                active={context.activeNote?.type === NoteType.SMALL}
                onClick={handleTypeChange}
            >
                <RiParenthesesLine size={Size.icon.XS} />
            </ControlButton>
        </Group>
    )
};

export default NoteTypeControls;
