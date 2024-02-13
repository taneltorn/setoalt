import * as Tone from "tone";
import {Note} from "../models/Note";
import {pitchToFrequency, transpose} from "../utils/helpers.tsx";
import {PlaybackOptions} from "../context/AudioContext.tsx";
import {Voice} from "../models/Voice.ts";

const useAudioPlayer = () => {

    const synths: { [key: string]: Tone.Synth } = {};

    const playNote = (note: Note, voice?: Voice, options?: PlaybackOptions) => {
        if (note.hidden) {
            return;
        }

        const id = `${voice?.name || 'global'}`;
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
