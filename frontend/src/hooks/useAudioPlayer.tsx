import * as Tone from "tone";
import {Note} from "../models/Note";
import {pitchToFrequency, transpose} from "../utils/helpers";
import {Voice} from "../models/Voice";

const useAudioPlayer = () => {

    const synths: { [key: string]: Tone.Synth } = {};

    const playNote = (note: Note, voice: Voice, detune?: number, semitones?: number) => {
        if (note.hidden) {
            return;
        }

        const id = `${voice.name || 'global'}`;
        try {
            if (!synths[id]) {
                synths[id] = new Tone.Synth().toDestination();
            }
            const pitch = semitones ? transpose(note.pitch, semitones) : note.pitch;
            const frequency = pitchToFrequency(pitch, detune);
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
