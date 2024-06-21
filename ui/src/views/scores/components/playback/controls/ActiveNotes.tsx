import React, {useMemo} from 'react';
import {Badge, Group} from "@mantine/core";
import Icon from "@mdi/react";
import {Icons} from "../../../../../utils/icons.ts";
import {mdiMusicNoteQuarter} from "@mdi/js";
import {useScoreContext} from "../../../../../context/ScoreContext.tsx";
import {excludeDuplicates} from "../../../../../utils/helpers.tsx";
import {Note} from "../../../../../models/Note.ts";

const ActiveNotes: React.FC = () => {

    const context = useScoreContext();

    const notesToShow: Note[] = useMemo(() => {
        if (context.isEditMode) {
            return context.activeNote ? [context.activeNote] : [];
        }
        return excludeDuplicates(context.getNotes(context.activePosition));

    }, [context.score, context.activeNote]);

    return (
        <Group gap={0}>
            {notesToShow.map((n, i) =>
                <Badge key={i} py={0} variant={"transparent"} color={"gray.7"}>
                    <Group gap={4}>
                        <Icon path={Icons.get(n.duration) || mdiMusicNoteQuarter} size={1}/>
                        {n.pitch}
                    </Group>
                </Badge>)}
        </Group>
    );
};

export default ActiveNotes;
