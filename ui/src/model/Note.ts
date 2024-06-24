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
    showDetuneIndicator?: boolean;

    color?: string;
    hidden?: boolean;
}
