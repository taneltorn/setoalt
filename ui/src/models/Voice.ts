import {Note} from "./Note";

export interface Voice {
    name: string;
    notes: Note[];
    options: VoiceOptions;
}


export interface VoiceOptions {
    color?: string;
    hidden?: boolean;
    disableOffset?: boolean;
}