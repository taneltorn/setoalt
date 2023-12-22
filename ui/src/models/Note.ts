export interface Note {
    pitch: string;
    duration: string;
    position: number;

    detune?: number;
    color?: string;
    hidden?: boolean;
}
