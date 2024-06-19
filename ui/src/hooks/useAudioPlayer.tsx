import * as Tone from "tone";
import {Note} from "../models/Note";
import {pitchToFrequency, transpose} from "../utils/helpers.tsx";
import {PlaybackOptions} from "../context/AudioContext.tsx";
import {Voice} from "../models/Voice.ts";

const useAudioPlayer = () => {

    const synths: { [key: string]: Tone.Synth } = {};
    const polySynth = new Tone.PolySynth().toDestination();

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

    const playNotes = (notes: Note[]) => {
        try {
            console.log("playing notes: ");

            const filteredNotes: Note[] = notes.reduce((acc, note) => {
                const key = `${note.pitch}-${note.duration}`;
                if (!acc.map.has(key)) {
                    acc.map.set(key, true);
                    acc.result.push(note);
                }
                return acc;
            }, { map: new Map<string, boolean>(), result: [] as Note[] }).result;
            console.log(filteredNotes);

            const pitches = filteredNotes.map(n => n.pitch);
            const durations = filteredNotes.map(n => n.duration);
            polySynth.triggerAttackRelease(pitches, durations);
        } catch (e) {
            console.log(e);
        }
    }

    return {
        playNote,
        playNotes,
    }
};

export default useAudioPlayer;
