import * as Tone from "tone";
import {Note} from "../models/Note";
import {pitchToFrequency, transpose} from "../utils/helpers.tsx";
import {AudioOptions} from "../models/AudioOptions.ts";

const useAudioPlayer = () => {

    const synths: { [key: string]: Tone.Synth } = {};

    const playNote = (note: Note, voice: string, options?: AudioOptions) => {
        if (note.hidden) {
            return;
        }

        const id = `${voice || 'global'}`;
        try {
            if (!synths[id]) {
                synths[id] = new Tone.Synth().toDestination();
            }
            const pitch = options?.transpose ? transpose(note.pitch, options.transpose) : note.pitch;
            const frequency = pitchToFrequency(pitch, options?.detune);
            synths[id].triggerAttackRelease(frequency, note.duration);
        } catch (e) {
            console.log(e);
        }
    }

    return {
        playNote
    }
};

export default useAudioPlayer;
