import * as Tone from "tone";
import {useState} from "react";
import {PolySynth, Sampler} from "tone";
import {Instrument} from "../model/Instrument.ts";
import {Playback} from "../utils/constants.ts";

const useAudioPlayer = () => {

    const volume = new Tone.Volume(Playback.DEFAULT_VOLUME).toDestination();
    const polySynth = new Tone.PolySynth().connect(volume);
    const [player, setPlayer] = useState<Sampler | PolySynth>(polySynth);

    const use = (instrument: Instrument) => {
        if (instrument.name === "synth") {
            setPlayer(polySynth);
            return;
        }
        setPlayer(new Tone.Sampler({
            urls: instrument.mapping,
            baseUrl: instrument.path
        }).connect(volume));
    }

    const playNotes = (frequencies: number[], durations: string[]) => {
        try {
            player.triggerAttackRelease(frequencies, durations);
        } catch (e) {
            console.log(e);
        }
    }

    const setVolume = (value: number) => {
        player.volume.value = value;
    };

    return {
        playNotes, use, setVolume
    }
};

export default useAudioPlayer;
