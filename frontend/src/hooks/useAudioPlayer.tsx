import * as Tone from "tone";
import {Note} from "../models/Note";
import {pitchToFrequency} from "../utils/helpers";
import {Voice} from "../models/Voice";
import {Line} from "../models/Line";

const useAudioPlayer = () => {

    const synths: { [key: string]: Tone.Synth } = {};

    const playNote = (note: Note, voice: Voice, line: Line | undefined) => {
        if (note.hidden) {
            return;
        }

        const id = `${voice.name || 'global'}`;
        try {
            if (!synths[id]) {
                synths[id] = new Tone.Synth().toDestination();
            }
            const frequency = pitchToFrequency(note.pitch, note.detune || line?.detune);
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
