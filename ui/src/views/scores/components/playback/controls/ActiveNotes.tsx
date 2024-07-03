import React, {useMemo} from 'react';
import {Badge, Group} from "@mantine/core";
import Icon from "@mdi/react";
import {NoteIcons} from "../../../../../utils/icons.tsx";
import {mdiMusicNoteQuarter} from "@mdi/js";
import {useScoreContext} from "../../../../../hooks/useScoreContext.tsx";
import {excludeDuplicates, getDetuneLabel, getTotalDetune} from "../../../../../utils/helpers.tsx";
import {Note} from "../../../../../model/Note.ts";
import {useTranslation} from "react-i18next";

const ActiveNotes: React.FC = () => {

    const {t} = useTranslation();
    const context = useScoreContext();

    const notesToShow: Note[] = useMemo(() => {
        if (context.isEditMode) {
            return context.activeNote ? [context.activeNote] : [];
        }
        return excludeDuplicates(context.getNotes(context.activePosition));

    }, [context.score, context.activeNote]);

    return (
        <Group gap={0} style={{position: "absolute"}}>
            {notesToShow.map((n, i) =>
                <Badge
                    key={i}
                    py={0}
                    variant={"transparent"}
                    color={"black"}
                    style={{textTransform: "capitalize"}}
                >
                    <Group gap={4}>
                        <Icon path={NoteIcons.get(n.duration) || mdiMusicNoteQuarter} size={1}/>
                        {n.pitch} {getDetuneLabel(getTotalDetune(n, context.score.data.stave), t("unit.centsAbbr"), true)}
                    </Group>
                </Badge>)}
            <Badge color={"transparent"}></Badge>
        </Group>
    );
};

export default ActiveNotes;
