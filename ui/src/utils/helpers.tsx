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
import {StaveDimensions} from "../models/Dimensions.ts";
import {Offset} from "../models/Offset.ts";
import {XY} from "../models/XY.ts";

export const isEmpty = (object: any) => {
    return !object || Object.keys(object).length === 0 || object.length === 0;
}

export const EmptyScore: Score = {
    id: "",
    name: "",
    data: {
        stave: {
            name: "",
            lines: []
        },
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

export const nextPosition = (currentPosition: number, note: Note | undefined, voices: Voice[], isEditMode: boolean): number => {
    if (isEditMode) {
        return note
            ? note.position + durationToScalar(note.duration)
            : currentPosition + 1;
    }

    const positions = getPositions(voices);
    const currentPositionIndex = positions.findIndex(p => p === currentPosition);

    return positions[Math.min(currentPositionIndex + 1, positions.length - 1)];
}


export const getNextPosition = (currentPosition: number, voices: Voice[], currentNote: Note | undefined, isEditMode: boolean): number => {
    if (isEditMode) {
        return currentNote
            ? currentNote.position + durationToScalar(currentNote.duration)
            : currentPosition + 1;
    }

    const positions = getPositions(voices);
    const currentPositionIndex = positions.findIndex(p => p === currentPosition);

    return positions[Math.min(currentPositionIndex + 1, positions.length - 1)];
}


export const getPreviousPosition = (currentPosition: number, voices: Voice[], currentVoice: Voice | undefined, isEditMode: boolean): number => {
    if (isEditMode) {
        const closestNote: Note | undefined = voices
            .filter(v => currentVoice ? v.name === currentVoice.name : true)
            .flatMap(v => v.notes)
            .filter(n => n.position < currentPosition)
            .slice(-1)?.[0];

        // todo fix - in edit mode not jumping to prev note if duration is e.g. 2n
        if (closestNote && (closestNote.position + durationToScalar(closestNote.duration)) > (currentPosition - 1)) {
            return closestNote.position;
        }
        return Math.max(currentPosition - 1, 0);
    }
    const positions = getPositions(voices);
    const currentPositionIndex = positions.findIndex(p => p === currentPosition);
    return positions[Math.max(currentPositionIndex - 1, 0)];
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

export const getDividerCoords = (position: number, context: ScoreContextProperties): Coordinates => {
    const c = getBreakCount(position, context.score.data.dividers);

    const x = position * Layout.stave.note.SPACING
        + Layout.stave.container.PADDING_X_START
        - (c > 0 ? context.score.data.dividers[c - 1].position * Layout.stave.note.SPACING : 0)
        + Layout.stave.note.SPACING / 2
        - Layout.stave.divider.CONTAINER_WIDTH / 2;
    const y = context.dimensions.y * (c) + Layout.stave.container.SYMBOLS_BAR;

    return {x: x, y: y};
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

export const getCursorCoords = (context: ScoreContextProperties): Coordinates => {
    const c = getBreakCount(context.currentPosition, context.score.data.dividers);

    const x = context.currentPosition * Layout.stave.note.SPACING
        + Layout.stave.container.PADDING_X_START
        - (c > 0 ? context.score.data.dividers[c - 1].position * Layout.stave.note.SPACING : 0)
        - Layout.stave.cursor.WIDTH / 2
        - Layout.stave.note.RADIUS / 2
    ;
    const y = context.dimensions.y * c - 30;

    return {x: x, y: y};
}

export const getBreakCoords = (position: number, context: ScoreContextProperties): Coordinates => {
    const c = getBreakCount(position, context.score.data.dividers);

    const x = Layout.stave.container.PADDING_X_START
        + (position) * Layout.stave.note.SPACING
        - (c > 1 ? context.score.data.dividers[c - 2].position * Layout.stave.note.SPACING : 0)
        // - Layout.stave.note.SPACING
        - Layout.stave.note.RADIUS;
    const y = context.dimensions.y * (c - 1) + 20;


    return {x: x, y: y};
}

export const getNoteCoords = (note: Note, voice: Voice, context: ScoreContextProperties): Coordinates => {
    const c = getBreakCount(note.position, context.score.data.dividers);

    const voiceIndex = context.score.data.voices.findIndex(v => v.name === voice.name);
    const count = context.score.data.voices.filter((v, i) => i < voiceIndex && !v.options.disableOffset)
        .flatMap(v => v.notes)
        .filter(n => n.position === note.position && n.pitch === note.pitch).length;

    const x = Layout.stave.container.PADDING_X_START
        + note.position * Layout.stave.note.SPACING
        - (c > 0 ? context.score.data.dividers[c - 1].position * Layout.stave.note.SPACING : 0)
        - Layout.stave.note.RADIUS / 2
        + (voice.options?.disableOffset ? 0 : count * Layout.stave.note.REPEATING_OFFSET);

    const line = context.score.data.stave.lines.find(l => l.pitch === note.pitch);
    const detune = note.detune || line?.detune || 0;

    const y = ((line?.y || 0) - detune / 100) * Layout.stave.line.SPACING
        + context.dimensions.y * c
        + Layout.stave.container.SYMBOLS_BAR;

    return {x: x, y: y};
}

export const getLineCoords = (line: Line, startingY: number, context: ScoreContextProperties): Coordinates => {
    const y = startingY
        + (line.y - (line.detune || 0) / 100) * Layout.stave.line.SPACING
        + Layout.stave.container.SYMBOLS_BAR;

    return {x: context.dimensions.x, y: y};
}

// todo optimize
const getMaxLength = (breakPoints: number[], end: number): number => {
    let max = 0;
    [...breakPoints, end].forEach((n, i) => {
        const r = n - (breakPoints[i - 1] || 0);
        if (r > max) {
            max = r;
        }
    });
    return max;
}

export const getDurationOffset = (a: string, b: string) => {
    return durationToScalar(a) - durationToScalar(b);
}

export const calculateOffset = (index: number, context: ScoreContextProperties): XY => {
    if (index === 0 || context.score.data.breaks.length === 0) {
        return {
            x: 0,
            y: 0
        }
    }
    return {
        x: context.score.data.breaks[index] * Layout.stave.note.SPACING,
        y: index * context.dimensions.y
    }
}

export const getOffset = (position: number, context: ScoreContextProperties, indexOffsetY?: number): XY => {
    const breakpoints = context.score.data.breaks;

    let index = breakpoints.findIndex(b => position < b);
    if (index === -1) {
        index = breakpoints.length;
    }

    return {
        x: index > 0 && breakpoints[index - 1] ? breakpoints[index - 1] * Layout.stave.note.SPACING : 0,
        y: (index + (indexOffsetY || 0)) * context.dimensions.y,
    };
}

export const getBreakOffset = (position: number, context: ScoreContextProperties): XY => {
    const breakpoints = context.score.data.breaks;

    let index = breakpoints.findIndex(b => position === b);
    if (index === -1) {
        index = breakpoints.length;
    }
    // - (index > 0 ? breaks[index - 1].position * Layout.stave.note.SPACING : 0);
    return {
        x: index > 0 && breakpoints[index - 1] ? breakpoints[index - 1] * Layout.stave.note.SPACING : 0,
        y: index * context.dimensions.y,
    };
}

export const getBlockNumber = (position: number, breakpoints: number[]): number => {
    let index = breakpoints.findIndex(b => position < b);
    if (index === 0) return 0;

    if (index === -1) return breakpoints.length;

    return index;
}

export const calculateStaveDimensions = (score: Score): StaveDimensions => {
    const bottomLineY = score.data.stave.lines.slice(-1)?.[0]?.y || 0;
    const y = Layout.stave.container.SYMBOLS_BAR
        + Layout.stave.line.SPACING * bottomLineY
        + Layout.stave.container.LYRICS_BAR;

    const x = Layout.stave.container.WIDTH;

    return {
        x: x,
        y: y,
        blocks: score.data.breaks.length + 1,
    };
}

export const calculateDimensions = (score: Score): { x: number, y: number } => {
    console.log("calc dimension")
    const y = (score.data.stave.lines.slice(-1)?.[0]?.y || 0) * Layout.stave.line.SPACING
        + Layout.lyrics.HEIGHT
    // score.data.voices.filter(voice => voice.notes.some(note => note.lyric)).length * Layout.lyrics.SPACING
    // + Layout.stave.container.PADDING_Y_TOP;

    const note = score.data.voices
        .flatMap(voice => voice.notes)
        .slice(-1)
        .pop();

    const end = note ? note.position + durationToScalar(note.duration) : 0;
    const x = getMaxLength(score.data.dividers.filter(d => d.type === DividerType.BREAK).map(d => d.position), end) * Layout.stave.note.SPACING
        + Layout.stave.container.PADDING_X_START
        + Layout.stave.container.PADDING_X_END

    return {
        x: Math.max(x, Layout.stave.container.MAX_WIDTH),
        y: y
    };
}

export const range = (n: number) => {
    return Array.from({length: n}, (_, index) => index + 1);
}

export const sort = (array: number[]) => {
    return array.sort((a, b) => (a || 0) - (b || 0));
}

export const getNoteTitle = (note: Note, line: Line | undefined, t: any): string => {
    const detune = note.detune || line?.detune || 0;
    const detuneStr = detune ? ` (${detune > 0 ? '+' : ''}${detune})` : '';
    return `${t("pitch." + note.pitch.toLowerCase())}${detuneStr}`;
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