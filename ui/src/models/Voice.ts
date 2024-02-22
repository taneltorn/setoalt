import {Note} from "./Note";

export interface Voice {
    name: string;
    notes: Note[];
    color: string;
    occupiedPositions?: number[];
    hidden?: boolean;
}
