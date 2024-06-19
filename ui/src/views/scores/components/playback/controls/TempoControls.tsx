import React from 'react';
import {useTranslation} from "react-i18next";
import {Group, Slider} from "@mantine/core";
import {Playback} from "../../../../../utils/constants.ts";
import {useAudioContext} from "../../../../../context/AudioContext.tsx";

const TempoControls: React.FC = () => {

    const {t} = useTranslation();
    const {tempo, setTempo} = useAudioContext();

    return (
        <Group gap={"xs"}>
            <Slider
                title={t("tooltip.changeTempo")}
                w={250}
                color={"black"}
                min={Playback.MIN_TEMPO}
                max={Playback.MAX_TEMPO}
                label={`${tempo} BPM`}
                value={tempo}
                step={Playback.TEMPO_SLIDER_STEP}
                onChange={v => setTempo(+v)}
            />
        </Group>
    );
};

export default TempoControls;
