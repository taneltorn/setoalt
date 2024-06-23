import {Note} from "./Note";

export enum VoiceType {
    TORRO,
    KILLO
}
export interface Voice {
    name: string;
    type: VoiceType;
    notes: Note[];
    color: string;
    occupiedPositions?: number[];
    hidden?: boolean;
}
