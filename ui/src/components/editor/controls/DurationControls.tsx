import React from 'react';
import {DurationToShortKey} from "../../../utils/mapping.ts";
import {useScoreContext} from "../../../context/ScoreContext.tsx";
import {Durations} from "../../../utils/dictionaries.ts";
import {useTranslation} from "react-i18next";
import {Group} from "@mantine/core";
import ControlButton from "../../common/ControlButton.tsx";
import Icon from "@mdi/react";
import {mdiMusicNoteEighth, mdiMusicNoteHalf, mdiMusicNoteQuarter} from "@mdi/js";

const icons = new Map([
    ["2n", mdiMusicNoteHalf],
    ["4n", mdiMusicNoteQuarter],
    ["8n", mdiMusicNoteEighth]
]);

const DurationControls: React.FC = () => {

    const [t] = useTranslation();
    const context = useScoreContext();

    return (
        <Group gap={4} ml={"lg"} className={"panel"}>
            {Durations.map(duration =>
                <ControlButton
                    key={duration}
                    className={"me-1"}
                    active={context.currentDuration === duration}
                    label={<Icon path={icons.get(duration) || mdiMusicNoteHalf} size={1}/>}
                    tooltip={t(`tooltip.changeDuration.${duration}`)}
                    shortKey={DurationToShortKey.get(duration)}
                    onClick={() => context.changeDuration(duration)}
                />)}
        </Group>
    )
};

export default DurationControls;
