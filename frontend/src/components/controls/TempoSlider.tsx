import React from 'react';
import {Playback} from "../../utils/constants";
import {useTranslation} from "react-i18next";
import {useAudioContext} from "../../context/AudioContext";
import {Group, Slider, Text} from "@mantine/core";

const TempoSlider: React.FC = () => {

    const {t} = useTranslation();
    const {tempo, setTempo} = useAudioContext();

    return (
        <Group>
            <Slider
                ml={"xl"}
                title={t("tooltip.changeTempo")}
                w={300}
                color={"black"}
                min={Playback.MIN_TEMPO}
                max={Playback.MAX_TEMPO}
                label={`${tempo}`}
                value={tempo}
                step={Playback.TEMPO_SLIDER_STEP}
                onChange={v => setTempo(+v)}
            />
            <Text w={80}>{`${tempo} BPM`}</Text>
        </Group>
    );
};

export default TempoSlider;
