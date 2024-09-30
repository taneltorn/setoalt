import {Stave} from "./Stave";
import {Voice} from "./Voice";
import {Lyric} from "./Lyric";
import {Divider} from "./Divider.ts";

export interface Score {
    id?: number;
    name: string;
    description?: string;
    recording?: string;
    data: ScoreData;
    defaultTempo?: number;
    defaultTransposition?: number;
    text?: string;
    visibility?: string;
    createdBy?: string;
    createdAt?: Date;
    modifiedAt?: Date;
}

export interface ScoreData {
    stave: Stave;
    voices: Voice[];
    lyrics: Lyric[];
    breaks: number[];
    dividers: Divider[];
}