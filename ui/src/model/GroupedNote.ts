import {Note} from "./Note.ts";

export interface GroupedNote {
    position: number;
    notes: Note[];
}