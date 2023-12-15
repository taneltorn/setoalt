import {Stave} from "./Stave";
import {Voice} from "./Voice";
import {Lyric} from "./Lyric";

export interface Score {
    id: string;
    title: string;
    description?: string;
    stave: Stave;
    voices: Voice[];
    lyrics: Lyric[];
    breaks: number[];
    dividers: number[];
    tempo?: number;
    text?: string;
}
