import {Note} from "./Note";

export interface Voice {
    name: string;
    color: string;
    notes: Note[];
    hidden?: boolean;
}
