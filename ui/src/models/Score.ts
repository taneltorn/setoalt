import {Stave} from "./Stave";
import {Voice} from "./Voice";
import {Lyric} from "./Lyric";
import {Divider} from "./Divider.ts";

export interface Score {
    id: string;
    name: string;
    description?: string;
    data: ScoreData;
    defaultTempo?: number;
    text?: string;
}

export interface ScoreData {
    stave: Stave;
    voices: Voice[];
    lyrics: Lyric[];
    breaks: number[];
    dividers: Divider[];
}