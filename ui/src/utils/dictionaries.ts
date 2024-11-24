import {Voice, VoiceType} from "../model/Voice";
import {Instrument} from "../model/Instrument.ts";
import {Setting} from "../views/scores/details/components/ScoreSettings.tsx";

export const DefaultVoices: Voice[] = [
    {
        name: "torrõ",
        type: VoiceType.TORRO,
        color: "black",
        notes: [],
        order: 0
    },
    {
        name: "killõ",
        type: VoiceType.KILLO,
        color: "#1aa7ec",
        notes: [],
        order: 1
    }
];

export const VoiceTypes = [
    VoiceType.TORRO,
    VoiceType.KILLO,
    VoiceType.BOTTOM_TORRO,
    VoiceType.FRONT,  
];

export const AllScoreSettings = [
    Setting.CHANGE_MODE,
    Setting.EMBED_CODE,
    Setting.EXPORT_PNG,
    Setting.CLONE_SCORE,
]
export const Durations: string[] = [
    "2n", "4n", "8n"
];

export const NoteRange = [
    "c3", "c#3", "d3", "d#3", "e3", "f3", "f#3", "g3", "g#3", "a3", "a#3", "b3",
    "c4", "c#4", "d4", "d#4", "e4", "f4", "f#4", "g4", "g#4", "a4", "a#4", "b4",
    "c5", "c#5", "d5", "d#5", "e5", "f5", "f#5", "g5", "g#5", "a5", "a#5", "b5",
    "c6", "c#6", "d6", "d#6", "e6", "f6", "f#6", "g6", "g#6", "a6", "a#6", "b6"
];

export const Instruments: Instrument[] = [
      {
        name: "piano",
        path: "/samples/piano/",
        mapping:{
            "C3": "C3.mp3",
            "D3": "D3.mp3",
            "D#3": "Ds3.mp3",
            "E3": "E3.mp3",
            "F3": "F3.mp3",
            "F#3": "Fs3.mp3",
            "G3": "G3.mp3",
            "G#3": "Gs3.mp3",
            "A3": "A3.mp3",
            "A#3": "As3.mp3",
            "B3": "B3.mp3",
            "C4": "C4.mp3",
            "D4": "D4.mp3",
            "D#4": "Ds4.mp3",
            "E4": "E4.mp3",
            "F4": "F4.mp3",
            "F#4": "Fs4.mp3",
            "G4": "G4.mp3",
            "G#4": "Gs4.mp3",
            "A4": "A4.mp3",
            "A#4": "As4.mp3",
            "B4": "B4.mp3",
            "C5": "C5.mp3",
            "D5": "D5.mp3",
            "D#5": "Ds5.mp3",
            "E5": "E5.mp3",
            "F5": "F5.mp3",
            "F#5": "Fs5.mp3",
            "G5": "G5.mp3",
            "G#5": "Gs5.mp3",
            "A5": "A5.mp3",
            "A#5": "As5.mp3",
            "B5": "B5.mp3",
            "C6": "C6.mp3",
            "D6": "D6.mp3",
            "D#6": "Ds6.mp3",
            "E6": "E6.mp3",
            "F6": "F6.mp3",
            "F#6": "Fs6.mp3",
            "G6": "G6.mp3",
            "G#6": "Gs6.mp3",
            "A6": "A6.mp3",
            "A#6": "As6.mp3",
            "B6": "B6.mp3",
        }
    },
    {
        name: "synth",
        path: "",
        mapping: {}
    },
    {
        name: "violin",
        path: "/samples/violin/",
        mapping: {
            "A3": "A3.mp3",
            "A4": "A4.mp3",
            "A5": "A5.mp3",
            "C4": "C4.mp3",
            "C5": "C5.mp3",
            "C6": "C6.mp3",
            "E4": "E4.mp3",
            "E5": "E5.mp3",
            "E6": "E6.mp3",
        }
    },
    {
        name: "flute",
        path: "/samples/flute/",
        mapping: {
            "A4": "A4.mp3",
            "A5": "A5.mp3",
            "A6": "A6.mp3",
            "C4": "C4.mp3",
            "C5": "C5.mp3",
            "C6": "C6.mp3",
            "E4": "E4.mp3",
            "E5": "E5.mp3",
            "E6": "E6.mp3",
        }
    } ,
    {
        name: "guitar",
        path: "/samples/guitar/",
        mapping: {
            "A3": "A3.mp3",
            "A4": "A4.mp3",
            "C3": "C3.mp3",
            "C4": "C4.mp3",
            "C5": "C5.mp3",
            "E3": "E3.mp3",
            "E4": "E4.mp3",
        }
    }
];
