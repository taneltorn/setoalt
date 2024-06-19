import * as Tone from "tone";
import {Frequency} from "tone";
import {Note} from "../models/Note";
import {Voice} from "../models/Voice";
import {Layout} from "./constants";
import {Score} from "../models/Score";
import {Line} from "../models/Line";
import {Coordinates} from "../models/Coordinates";
import {ScoreContextProperties} from "../context/ScoreContext";
import {DefaultVoices, NoteRange} from "./dictionaries.ts";
import {notifications} from "@mantine/notifications";
import {IoMdAlert} from "react-icons/io";
import {StavePPT} from "../staves/StavePPT.ts";

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

    const sixteenthNotes = x;

    return (wholeNotes * wholeNoteDuration) +
        (halfNotes * halfNoteDuration) +
        (quarterNotes * quarterNoteDuration) +
        (eighthNotes * eighthNoteDuration) +
        (sixteenthNotes * sixteenthNoteDuration);
}

export const pitchToFrequency = (pitch: string, detune?: number): number => {
    const frequency = Frequency(pitch).toFrequency();
    return detune
        ? Frequency(frequency).transpose(detune / 100).toFrequency()
        : frequency;
};

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


export const isDimmed = (note: Note, voice: Voice, scoreContext: ScoreContextProperties) => {
    return !scoreContext.score.data.stave.lines.find(l => l.pitch === note.pitch) ||
        scoreContext.isEditMode && voice.hidden;
}

export const isHighlighted = (note: Note, context: ScoreContextProperties) => {
    if (context.isExportMode) {
        return false;
    }
    if (context.currentNote && context.isEditMode) {
        return context.currentNote.position === note.position && context.currentNote.pitch === note.pitch;
    }
    return context.currentPosition === note.position;
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

export const transpose = (pitch: string, semitones: number): string => {
    const index = NoteRange.findIndex(n => n === pitch);
    if (index !== undefined) {
        return NoteRange[index + semitones];
    }
    return "";
}

export const getPositionRange = (note: Note) => {
    return range(note.position, note.position + durationToScalar(note.duration) - 1);
}

export const includeNotePositionRange = (voice: Voice, note: Note): number[] => {
    if (!voice.occupiedPositions) {
        return [];
    }
    const positionRange = getPositionRange(note);
    return sort(Array.from(new Set([...voice.occupiedPositions, ...positionRange])));
}

export const excludeNotePositionRange = (voice: Voice, note: Note): number[] => {
    if (!voice.occupiedPositions) {
        return [];
    }
    const positionRange = getPositionRange(note);
    return voice.occupiedPositions.filter(p => !positionRange.includes(p));
}

export const wouldProduceOverlap = (voice: Voice, note: Note) => {
    if (!voice.occupiedPositions) {
        return false;
    }
    const positionRange = getPositionRange(note);
    return positionRange.some(p => voice.occupiedPositions && voice.occupiedPositions.includes(p));
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