import {Note} from "./Note";

export interface Voice {
    name: string;
    notes: Note[];
    color: string;
    options?: VoiceOptions;
}


export interface VoiceOptions {
    hidden?: boolean;
    disableOffset?: boolean;
}