import {Voice} from "../models/Voice";

export const DefaultVoices: Voice[] = [
    {
        name: "torrõ",
        color: "black",
        notes: []
    },
    {
        name: "killõ",
        color: "#1aa7ec",
        notes: []
    }
];

export const Durations: string[] = [
    "2n", "4n", "8n"
];

export const NoteRange = [
    "c3", "c#3", "d3", "d#3", "e3", "f3", "f#3", "g3", "g#3", "a3", "a#3", "b3",
    "c4", "c#4", "d4", "d#4", "e4", "f4", "f#4", "g4", "g#4", "a4", "a#4", "b4",
    "c5", "c#5", "d5", "d#5", "e5", "f5", "f#5", "g5", "g#5", "a5", "a#5", "b5",
    "c6", "c#6", "d6", "d#6", "e6", "f6", "f#6", "g6", "g#6", "a6", "a#6", "b6"
];