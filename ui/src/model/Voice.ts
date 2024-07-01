import {Note} from "./Note";

export enum VoiceType {
    TORRO,
    KILLO,
    BOTTOM_TORRO
}

export interface Voice {
    name: string;
    type: VoiceType;
    notes: Note[];
    color: string;
    occupiedPositions?: number[];
    hidden?: boolean;
}
