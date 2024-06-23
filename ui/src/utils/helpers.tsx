import * as Tone from "tone";
import {Frequency} from "tone";
import {Note} from "../model/Note";
import {Voice} from "../model/Voice";
import {Layout} from "./constants";
import {Score} from "../model/Score";
import {Line} from "../model/Line";
import {Coordinates} from "../model/Coordinates";
import {ScoreContextProperties} from "../context/ScoreContext";
import {DefaultVoices, NoteRange} from "./dictionaries.ts";
import {notifications} from "@mantine/notifications";
import {IoMdAlert} from "react-icons/io";
import {StavePPT} from "../staves/StavePPT.ts";
import {Stave} from "../model/Stave.ts";

export const isEmpty = (object: any) => {
    return !object || Object.keys(object).length === 0 || object.length === 0;
}

export const EmptyScore: Score = {
    name: "",
    data: {
        stave: StavePPT,
        breaks: [],
        dividers: [],
        lyrics: [],
        voices: [...DefaultVoices]
    }
}

export const durationToScalar = (duration: string): number => {
    switch (duration) {
        case "1n":
            return 8;
        case "2n":
            return 4;
        case "4n":
            return 2;
        case "8n":
            return 1;
        case "16n":
            return 0.5;
        default:
            return 1;
    }
}

export const positionToSeconds = (x: number): number => {
    const wholeNoteDuration = Tone.Time("1n").toSeconds();
    const halfNoteDuration = Tone.Time("2n").toSeconds();
    const quarterNoteDuration = Tone.Time("4n").toSeconds();
    const eighthNoteDuration = Tone.Time("8n").toSeconds();
    const sixteenthNoteDuration = Tone.Time("16n").toSeconds();

    const wholeNotes = Math.floor(x / 8);
    x -= wholeNotes * 8;

    const halfNotes = Math.floor(x / 4);
    x -= halfNotes * 4;

    const quarterNotes = Math.floor(x / 2);
    x -= quarterNotes * 2;

    const eighthNotes = Math.floor(x);
    x -= eighthNotes;

    const sixteenthNotes = x * 2;

    return (wholeNotes * wholeNoteDuration) +
        (halfNotes * halfNoteDuration) +
        (quarterNotes * quarterNoteDuration) +
        (eighthNotes * eighthNoteDuration) +
        (sixteenthNotes * sixteenthNoteDuration);
}

export const excludeDuplicates = (notes: Note[]): Note[] => {
    return notes.reduce((acc, note) => {
        const key = `${note.pitch}-${note.duration}-${note.detune || 0}`;
        if (!acc.map.has(key)) {
            acc.map.set(key, true);
            acc.result.push(note);
        }
        return acc;
    }, {map: new Map<string, boolean>(), result: [] as Note[]}).result;
}

export const noteToFrequency = (note: Note, stave: Stave, transposition?: number): number => {
    const frequency = Frequency(transpose(note.pitch, transposition)).toFrequency();
    const detune = (note.detune || 0) + (stave.lines.find(l => l.pitch === note.pitch)?.detune || 0);

    return detune
        ? Frequency(frequency).transpose(detune / 100).toFrequency()
        : frequency;
};

export const createNote = (pitch: string, position: number, duration: string): Note => {
    return {
        pitch: pitch,
        position: position > 0 ? position : 0,
        duration: duration,
    }
}

export const getPositions = (voices: Voice[]) => {
    return sort(Array.from(new Set(voices.flatMap(v => v.notes).map(n => n.position))));
}

export const getNextPitch = (pitches: string[], currentPitch: string): string => {
    const currentIndex = pitches.findIndex(p => p === currentPitch);
    return pitches[Math.max(currentIndex - 1, 0)];
}

export const getPreviousPitch = (pitches: string[], currentPitch: string): string => {
    const currentIndex = pitches.findIndex(p => p === currentPitch);
    return pitches[Math.min(currentIndex + 1, pitches.length - 1)];
}

export const getLineCoords = (line: Line, startingY: number, context: ScoreContextProperties): Coordinates => {
    const y = startingY
        + line.y * Layout.stave.line.SPACING
        + Layout.stave.container.SYMBOLS_BAR;

    return {x: context.dimensions.x, y: y};
}

export const getDurationOffset = (a: string, b: string) => {
    return durationToScalar(a) - durationToScalar(b);
}

export const isHighlighted = (note: Note, context: ScoreContextProperties) => {
    if (context.isExportMode) {
        return false;
    }
    return context.activePosition === note.position;
}

export const range = (start: number, end?: number): number[] => {
    if (!end) {
        return Array.from({length: start}, (_, index) => index + 1);
    }
    return Array.from({length: end - start + 1}, (_, i) => start + i);
}

export const sort = (array: number[]) => {
    return array.sort((a, b) => (a || 0) - (b || 0));
}

export const transpose = (pitch: string, transposition?: number): string => {
    if (!transposition) {
        return pitch;
    }
    const index = NoteRange.findIndex(n => n === pitch);
    if (index !== undefined) {
        return NoteRange[index + transposition];
    }
    return "";
}

export const getPositionRange = (note: Note) => {
    return range(note.position, note.position + durationToScalar(note.duration) - 0.5);
}

export const includeNotePositionRange = (note: Note, occupiedPositions: number[] | undefined): number[] => {
    if (!occupiedPositions) {
        return [];
    }
    const positionRange = getPositionRange(note);
    return sort(Array.from(new Set([...occupiedPositions, ...positionRange])));
}

export const excludeNotePositionRange = (note: Note, occupiedPositions: number[] | undefined): number[] => {
    if (!occupiedPositions) {
        return [];
    }
    const positionRange = getPositionRange(note);
    return occupiedPositions.filter(p => !positionRange.includes(p));
}

export const wouldProduceOverlap = (note: Note, occupiedPositions: number[] | undefined) => {
    if (!occupiedPositions) {
        return false;
    }
    const positionRange = getPositionRange(note);
    return positionRange.some(p => occupiedPositions && occupiedPositions.includes(p));
}

export const DisplayError = (title: string, message: string) => {
    notifications.show({
        title: title,
        message: message,
        icon: <IoMdAlert color={"red"} size={40}/>,
        color: "white"
    });
}

export const DisplaySuccess = (title: string, message: string) => {
    notifications.show({
        title: title,
        message: message,
        icon: <IoMdAlert color={"green"} size={40}/>,
        color: "white"
    });
}

export const clone = (object: any): any => {
    return JSON.parse(JSON.stringify(object));
}

export const getDetuneLabel = (detune: number | undefined): string => {
    if (!detune) {
        return "";
    }
    return ` (${detune > 0 ? "+" : ""}${detune})`
}