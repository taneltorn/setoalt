import * as Tone from "tone";
import {useState} from "react";
import {PolySynth, Sampler} from "tone";
import {Instrument} from "../model/Instrument.ts";

const useAudioPlayer = () => {

    const polySynth = new Tone.PolySynth().toDestination();
    const [player, setPlayer] = useState<Sampler | PolySynth>(polySynth);

    const use = (instrument: Instrument) => {
        if (instrument.name === "synth") {
            setPlayer(polySynth);
            return;
        }
        setPlayer(new Tone.Sampler({
            urls: instrument.mapping,
            baseUrl: instrument.path
        }).toDestination());
    }

    const playNotes = (frequencies: number[], durations: string[]) => {
        try {
            player.triggerAttackRelease(frequencies, durations);
        } catch (e) {
            console.log(e);
        }
    }

    return {
        playNotes, load: use
    }
};

export default useAudioPlayer;
