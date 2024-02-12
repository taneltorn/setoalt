import * as Tone from "tone";
import {Frequency} from "tone";
import {Note} from "../models/Note";
import {Voice} from "../models/Voice";
import {Layout} from "./constants";
import {Score} from "../models/Score";
import {Line} from "../models/Line";
import {Coordinates} from "../models/Coordinates";
import {ScoreContextProperties} from "../context/ScoreContext";
import {NoteRange} from "./dictionaries.ts";
import {notifications} from "@mantine/notifications";
import {IoMdAlert} from "react-icons/io";
import {Divider, DividerType} from "../models/Divider.ts";
import {StavePPT} from "../staves/StavePPT.ts";
import {AudioContextProperties} from "../context/AudioContext.tsx";

export const isEmpty = (object: any) => {
    return !object || Object.keys(object).length === 0 || object.length === 0;
}

export const EmptyScore: Score = {
    id: "",
    name: "",
    data: {
        stave: StavePPT,
        breaks: [],
        dividers: [],
        lyrics: [],
        voices: []
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


// TODO useBreakCount or something similar
export const getBreakCount = (position: number, dividers: Divider[]) => {
    const breaks = dividers.filter(d => d.type === DividerType.BREAK).map(d => d.position);
    let n = 0;
    breaks.forEach(v => {
        if (position >= v) {
            n += 1;
        }
    })
    return n;
}


export const getLyricCoords = (position: number, context: ScoreContextProperties): Coordinates => {
    const c = getBreakCount(position, context.score.data.dividers);

    const x = position * Layout.stave.note.SPACING
        + Layout.stave.container.PADDING_X_START
        - (c > 0 ? context.score.data.dividers[c - 1].position * Layout.stave.note.SPACING : 0)
        - Layout.stave.note.RADIUS * 2;
    const y = context.dimensions.y * (c + 1) - Layout.lyrics.HEIGHT
        + 30
        + Layout.stave.container.SYMBOLS_BAR;

    return {x: x, y: y};
}


export const getLineCoords = (line: Line, startingY: number, context: ScoreContextProperties): Coordinates => {
    const y = startingY
        + (line.y - (line.detune || 0) / 100) * Layout.stave.line.SPACING
        + Layout.stave.container.SYMBOLS_BAR;

    return {x: context.dimensions.x, y: y};
}

export const getDurationOffset = (a: string, b: string) => {
    return durationToScalar(a) - durationToScalar(b);
}


export const isDimmed = (note: Note, voice: Voice, scoreContext: ScoreContextProperties, audioContext: AudioContextProperties) => {
    return !scoreContext.score.data.stave.lines.find(l => l.pitch === note.pitch) ||
        !audioContext.isPlaying && scoreContext.isEditMode && !!scoreContext.filter.voices?.length && !scoreContext.filter.voices.includes(voice.name);
}

export const isHighlighted = (note: Note, context: ScoreContextProperties) => {
    if (context.currentNote) {
        return context.currentNote.position === note.position && context.currentNote.pitch === note.pitch;
    }
    return false;
}


export const range = (n: number) => {
    return Array.from({length: n}, (_, index) => index + 1);
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

export const canShiftLeft = (currentPosition: number, note?: Note) => {
    if (currentPosition < 0) {
        return false;
    }
    if (note) {
        const maxPosition = currentPosition - 1 + durationToScalar(note.duration);

        return maxPosition < (currentPosition - 1);
    }

    return true;
}

export const DisplayGlobalError = (title: string, message: string) => {
    notifications.show({
        title: title,
        message: message,
        icon: <IoMdAlert color={"red"} size={40}/>,
        color: "white"
    });
}