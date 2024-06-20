import * as Tone from "tone";

const useAudioPlayer = () => {

    const polySynth = new Tone.PolySynth().toDestination();

    const playNotes = (frequencies: number[], durations: string[]) => {
        try {
            polySynth.triggerAttackRelease(frequencies, durations);
        } catch (e) {
            console.log(e);
        }
    }

    return {
        playNotes
    }
};

export default useAudioPlayer;
