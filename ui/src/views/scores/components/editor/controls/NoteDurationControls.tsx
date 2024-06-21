import React from 'react';
import {DurationToShortKey} from "../../../../../utils/mapping.ts";
import {useScoreContext} from "../../../../../context/ScoreContext.tsx";
import {Durations} from "../../../../../utils/dictionaries.ts";
import {useTranslation} from "react-i18next";
import {Group} from "@mantine/core";
import ControlButton from "../../../../../components/controls/ControlButton.tsx";
import Icon from "@mdi/react";
import {Icons} from "../../../../../utils/icons.ts";
import {mdiMusicNoteQuarter} from "@mdi/js";

const NoteDurationControls: React.FC = () => {

    const [t] = useTranslation();
    const context = useScoreContext();

    return (
        <Group gap={4}>
            {Durations.map(duration =>
                <ControlButton
                    key={duration}
                    active={context.activeNote ? context.activeNote.duration === duration : context.activeDuration === duration}
                    disabled={context.activeNote?.duration === "16n"}
                    label={<Icon path={Icons.get(duration) || mdiMusicNoteQuarter} size={1}/>}
                    tooltip={t(`tooltip.changeNoteDuration.${duration}`)}
                    shortKey={DurationToShortKey.get(duration)}
                    onClick={() => context.setActiveDuration(duration)}
                />)}
        </Group>
    )
};

export default NoteDurationControls;
