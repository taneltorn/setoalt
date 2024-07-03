import * as Tone from "tone";
import {Frequency} from "tone";
import {Note} from "../model/Note";
import {Voice} from "../model/Voice";
import {Layout, Size} from "./constants";
import {Score} from "../model/Score";
import {Line} from "../model/Line";
import {DefaultVoices, NoteRange} from "./dictionaries.ts";
import {notifications} from "@mantine/notifications";
import {StavePPT} from "../staves/StavePPT.ts";
import {Stave} from "../model/Stave.ts";
import {FaRegCheckCircle} from "react-icons/fa";
import {RiErrorWarningFill} from "react-icons/ri";
import {DateValue} from "@mantine/dates";
import {Notification} from "../model/Notification.ts";
import {ScoreContextProperties} from "../context/ScoreContext.tsx";
import {XY} from "../model/XY.ts";

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

export const normalize = (score: Score): Score => {
    score.data.voices.forEach(v => {
        v.hidden = undefined;
        v.occupiedPositions = undefined;
    });

    return score;
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

export const getPositions = (voices: Voice[]) => {
    return sort(Array.from(new Set(voices.flatMap(v => v.notes).map(n => n.position))));
}

export const getLineCoords = (line: Line, startingY: number, context: ScoreContextProperties): XY => {
    const y = startingY
        + line.y * Layout.stave.line.SPACING
        + Layout.stave.container.SYMBOLS_BAR;

    return {x: context.dimensions.x, y: y};
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

export const DisplayError = (message: string) => {
    notifications.show({
        color: 'red',
        message: message,
        p: "md",
        radius: "sm",
        withBorder: true,
        icon: <RiErrorWarningFill size={Size.icon.MD}/>,
    });
}

export const DisplaySuccess = (message: string) => {
    notifications.show({
        color: 'white',
        message: message,
        p: "md",
        radius: "sm",
        withBorder: true,
        icon: <FaRegCheckCircle color={"green"} size={Size.icon.MD}/>,
    });
}

export const clone = (object: any): any => {
    return JSON.parse(JSON.stringify(object));
}

export const getTotalDetune = (note: Note, stave: Stave) => {
    return (note.detune || 0) + (stave.lines.find(l => l.pitch === note.pitch)?.detune || 0);
}

export const getDetuneLabel = (detune: number | undefined, unit?: string, parenthesis?: boolean): string => {
    if (!detune) {
        return "";
    }
    const label = `${detune > 0 ? "+" : ""}${detune}${unit ? unit : ""}`;
    return parenthesis ? ` (${label})` : label;
}


export const getTempoLabel = (current: number, original: number = 80): string => {
    if (current === original) {
        return "";
    }
    const delta = Math.round(current / original * 100 - 100);
    return `${delta > 0 ? "+" : ""}${delta}%`
}

export const dayStart = (value: DateValue): DateValue | null => {
    if (!value) {
        return null;
    }

    value.setHours(0);
    value.setMinutes(0);
    value.setSeconds(0);

    return value;
}

export const dayEnd = (value: DateValue): DateValue | null => {
    if (!value) {
        return null;
    }

    value.setHours(23);
    value.setMinutes(59);
    value.setSeconds(59);

    return value;
}

export const isActive = (notification: Notification): boolean => {
    const currentTime = new Date();

    return (!notification.validFrom || new Date(notification.validFrom) <= currentTime)
        && (!notification.validTo || new Date(notification.validTo) >= currentTime)
}

export const DateFormatter = new Intl.DateTimeFormat('et-EE', {dateStyle: 'long'});
