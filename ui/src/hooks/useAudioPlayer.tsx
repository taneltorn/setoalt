import * as Tone from "tone";
import {useState} from "react";
import {PolySynth, Sampler} from "tone";
import {Instrument} from "../model/Instrument.ts";
import {Playback} from "../utils/constants.ts";

const useAudioPlayer = () => {

    const volume = new Tone.Volume(Playback.DEFAULT_VOLUME).toDestination();
    const polySynth = new Tone.PolySynth().connect(volume);
    const [player, setPlayer] = useState<Sampler | PolySynth>(polySynth);

    const use = (instrument: Instrument, onLoadCallback: () => void) => {
        if (instrument.name === "synth") {
            setPlayer(polySynth);
            onLoadCallback();
            return;
        }

        const sampler = new Tone.Sampler({
            urls: instrument.mapping,
            baseUrl: instrument.path,
            onload: onLoadCallback
        }).connect(volume);

        setPlayer(sampler);
    };

    const playNotes = (frequencies: number[], durations: string[]) => {
        try {
            player.triggerAttackRelease(frequencies, durations);
        } catch (e) {
            console.log(e);
        }
    }

    const setVolume = (value: number) => {
        player.volume.value = value <= Playback.MIN_VOLUME ? -100 : value;
    };

    return {
        playNotes, use, setVolume
    }
};

export default useAudioPlayer;
