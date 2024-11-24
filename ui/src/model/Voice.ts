import {Note} from "./Note";

export enum VoiceType {
    TORRO,
    KILLO,
    BOTTOM_TORRO,
    FRONT = 3,
}

export interface Voice {
    name: string;
    type: VoiceType;
    notes: Note[];
    color: string;
    occupiedPositions?: number[];
    hidden?: boolean;
    order?: number;
}
