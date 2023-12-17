import {Frequency} from "tone";
import {Note} from "../models/Note";
import {Voice} from "../models/Voice";
import {Stave} from "../models/Stave";
import {Layout} from "./constants";
import {Score} from "../models/Score";
import * as Tone from "tone";
import {Line} from "../models/Line";
import {Coordinates} from "../models/Coordinates";
import {ScoreContextProperties} from "../context/ScoreContext";
import {NoteRange} from "./dictionaries.ts";

export const isEmpty = (object: any) => {
    return !object || Object.keys(object).length === 0 || object.length === 0;
}

export const extractNotes = (stave: Stave | undefined) => {
    return stave?.lines
        .map(l => `${l.pitch.toUpperCase().slice(0, l.pitch.length - 1)}`)
        .reverse()
        .join("-");
}

export const EmptyScore: Score = {
    id: "",
    title: "",
    stave: {
        name: "",
        lines: []
    },
    breaks: [],
    dividers: [],
    lyrics: [],
    voices: []
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
    const currentIndex = positions.findIndex(p => p === currentPosition);
    return positions[Math.max(currentIndex - 1, 0)];
}


export const getNextPitch = (pitches: string[], currentPitch: string): string => {
    const currentIndex = pitches.findIndex(p => p === currentPitch);
    return pitches[Math.max(currentIndex - 1, 0)];
}

export const getPreviousPitch = (pitches: string[], currentPitch: string): string => {
    const currentIndex = pitches.findIndex(p => p === currentPitch);
    return pitches[Math.min(currentIndex + 1, pitches.length - 1)];
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

export const getBreakCount = (position: number, breaks: number[]) => {
    let n = 0;
    breaks.forEach(v => {
        if (position >= v) {
            n += 1;
        }
    })
    return n;
}

export const getDividerCoords = (position: number, context: ScoreContextProperties): Coordinates => {
    const c = getBreakCount(position, context.score.breaks);

    const x = position * Layout.stave.note.SPACING
        + Layout.stave.container.PADDING_X_START
        - (c > 0 ? context.score.breaks[c - 1] * Layout.stave.note.SPACING : 0)
        + Layout.stave.note.SPACING / 2
        - Layout.stave.divider.CONTAINER_WIDTH / 2;
    const y = context.dimensions.y * (c) + Layout.stave.container.SYMBOLS_BAR;

    return {x: x, y: y};
}

export const getLyricCoords = (position: number, context: ScoreContextProperties): Coordinates => {
    const c = getBreakCount(position, context.score.breaks);

    const x = position * Layout.stave.note.SPACING
        + Layout.stave.container.PADDING_X_START
        - (c > 0 ? context.score.breaks[c - 1] * Layout.stave.note.SPACING : 0)
        - Layout.stave.note.RADIUS * 2;
    const y = context.dimensions.y * (c + 1) - Layout.lyrics.HEIGHT
        + 30
        + Layout.stave.container.SYMBOLS_BAR;

    return {x: x, y: y};
}

export const getCursorCoords = (context: ScoreContextProperties): Coordinates => {
    const c = getBreakCount(context.currentPosition, context.score.breaks);

    const x = context.currentPosition * Layout.stave.note.SPACING
        + Layout.stave.container.PADDING_X_START
        - (c > 0 ? context.score.breaks[c - 1] * Layout.stave.note.SPACING : 0)
        - Layout.stave.cursor.WIDTH / 2
        - Layout.stave.note.RADIUS / 2
    ;
    const y = context.dimensions.y * c - 30;

    return {x: x, y: y};
}

export const getBreakCoords = (position: number, context: ScoreContextProperties): Coordinates => {
    const c = getBreakCount(position, context.score.breaks);

    const x = Layout.stave.container.PADDING_X_START
        + (position) * Layout.stave.note.SPACING
        - (c > 1 ? context.score.breaks[c - 2] * Layout.stave.note.SPACING : 0)
        // - Layout.stave.note.SPACING
        - Layout.stave.note.RADIUS;
    const y = context.dimensions.y * (c - 1) + 20;


    return {x: x, y: y};
}

export const getNoteCoords = (note: Note, voice: Voice, context: ScoreContextProperties): Coordinates => {
    const c = getBreakCount(note.position, context.score.breaks);

    const voiceIndex = context.score.voices.findIndex(v => v.name === voice.name);
    const count = context.score.voices.filter((_, i) => i < voiceIndex)
        .flatMap(v => v.notes)
        .filter(n => n.position === note.position && n.pitch === note.pitch).length;

    const x = Layout.stave.container.PADDING_X_START
        + note.position * Layout.stave.note.SPACING
        - (c > 0 ? context.score.breaks[c - 1] * Layout.stave.note.SPACING : 0)
        - Layout.stave.note.RADIUS / 2
        + count * Layout.stave.note.REPEATING_OFFSET;

    const line = context.score.stave.lines.find(l => l.pitch === note.pitch);
    const detune = note.detune || line?.detune || 0;

    const y = ((line?.y || 0) - detune / 100) * Layout.stave.line.SPACING
        + Layout.stave.container.PADDING_Y_TOP
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

export const calculateDimensions = (score: Score): { x: number, y: number } => {
    const y = (score.stave.lines.slice(-1)?.[0]?.y || 0) * Layout.stave.line.SPACING
        + Layout.lyrics.HEIGHT
        // score.voices.filter(voice => voice.notes.some(note => note.lyric)).length * Layout.lyrics.SPACING
        + Layout.stave.container.PADDING_Y_TOP;

    const note = score.voices
        .flatMap(voice => voice.notes)
        .slice(-1)
        .pop();

    const end = note ? note.position + durationToScalar(note.duration) : 0;
    const x = getMaxLength(score.breaks, end) * Layout.stave.note.SPACING
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

export const prepareScoreForOpening = (score: Score) => {
    score.voices.flatMap(v => v.notes)
        .forEach(n => {
            const line = score.stave.lines.find(l => l.pitch === n.pitch);
            if (line?.detune) {
                n.detune = line.detune;
            }
        });
    return score;
}

export const transpose = (pitch: string, semitones: number): string => {
    const index = NoteRange.findIndex(n => n === pitch);
    if (index !== undefined) {
        return  NoteRange[index + semitones];
    }
    return "";
}