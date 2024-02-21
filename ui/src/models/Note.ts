export enum NoteType {
    REGULAR = "Regular",
    SMALL = "Small"
}

export interface Note {
    pitch: string;
    duration: string;
    position: number;

    type?: NoteType;
    detune?: number;
    color?: string;
    hidden?: boolean;
}
