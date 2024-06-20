import {Voice, VoiceType} from "../models/Voice.ts";
import {ScoreContextProperties} from "../context/ScoreContext.tsx";
import {Layout} from "./constants.ts";
import {Note} from "../models/Note.ts";
import {XY} from "../models/XY.ts";
import {Divider} from "../models/Divider.ts";
import {Score} from "../models/Score.ts";
import {StaveDimensions} from "../models/Dimensions.ts";
import {Lyric} from "../models/Lyric.ts";

// todo: could refactor a lot here

export const calculateBreakCoords = (position: number, context: ScoreContextProperties): XY => {
    const offset = getBreakOffset(position, context);
    const x = Layout.stave.container.PADDING_X_START
        + position * Layout.stave.note.SPACING
        - offset.x;

    const y = Layout.stave.container.SYMBOLS_BAR / 2
        + offset.y;

    return {x: x, y: y};
}

export const calculateDividerCoords = (divider: Divider, context: ScoreContextProperties): XY => {
    const offset = getOffset(divider.position, context, 0, true);

    const x = Layout.stave.container.PADDING_X_START
        + divider.position * Layout.stave.note.SPACING
        - Layout.stave.note.RADIUS
        - Layout.stave.divider.WIDTH
        - Layout.stave.note.SPACING / 2
        - offset.x;

    const y = Layout.stave.container.SYMBOLS_BAR
        + offset.y
        - Layout.stave.divider.SEPARATOR_HEIGHT / 2;

    return {x: x, y: y};
}

export const calculateLyricCoords = (lyric: Lyric, context: ScoreContextProperties): XY => {
    const offset = getOffset(lyric.position, context);

    const x = Layout.stave.container.PADDING_X_START
        + lyric.position * Layout.stave.note.SPACING
        - Layout.stave.note.RADIUS * 1.8
        - offset.x;

    const y = context.dimensions.y
        -  Layout.stave.container.LYRICS_BAR / 2
        + offset.y;

    return {x: x, y: y};
}

export const calculateCurrentPositionCoords = (context: ScoreContextProperties): XY => {
    const offset = getOffset(context.activePosition, context);

    const x = Layout.stave.container.PADDING_X_START
        + context.activePosition * Layout.stave.note.SPACING
        - Layout.stave.cursor.WIDTH / 2
        - Layout.stave.note.RADIUS / 2
        - offset.x;

    const y = offset.y;

    return {x: x, y: y};
}

export const calculateNoteCoords = (note: Note, voice: Voice, context: ScoreContextProperties): XY => {
    const offset = getOffset(note.position, context);

    if (voice.type === VoiceType.KILLO) {
        const positionOccupied = context.score.data.voices
            .filter(v => v.type !== VoiceType.KILLO)
            .flatMap(v => v.notes)
            .find(n => n.position === note.position && n.pitch === note.pitch);
        if (positionOccupied) {
            offset.x -= Layout.stave.note.REPEATING_OFFSET;
        }
    }

    const x = Layout.stave.container.PADDING_X_START
        + note.position * Layout.stave.note.SPACING
        - Layout.stave.note.RADIUS / 2
        - offset.x;

    const line = context.score.data.stave.lines.find(l => l.pitch === note.pitch);
    const detune = note.detune || line?.detune || 0;

    const y = Layout.stave.container.SYMBOLS_BAR
        + ((line?.y || 0) - detune / 100) * Layout.stave.line.SPACING
        + offset.y;

    return {x: x, y: y};
}

export const calculateCursorCoords = (context: ScoreContextProperties): XY => {
    const offset = getOffset(context.cursorPosition, context);

    const x = Layout.stave.container.PADDING_X_START
        + context.cursorPosition * Layout.stave.note.SPACING
        - Layout.stave.cursor.WIDTH / 2
        - Layout.stave.note.RADIUS / 2
        - offset.x;

    const y = offset.y;

    return {x: x, y: y};
}


export const calculateCursorNoteCoords = (pitch: string, cursorX: number, cursorY: number, context: ScoreContextProperties): XY => {
    const line = context.score.data.stave.lines.find(l => l.pitch === pitch);
    if (line) {
        const x = cursorX + Layout.stave.cursor.WIDTH / 2;
        const y = cursorY
            + Layout.stave.container.SYMBOLS_BAR
            + (line?.y || 0) * Layout.stave.line.SPACING
            // - Layout.stave.cursor.Y_OFFSET;
        return {
            x, y
        }
    }
    return {x: 0, y: 0}
}

export const calculateStaveBlockCoords = (index: number, context: ScoreContextProperties): XY => {
    if (index === 0 || context.score.data.breaks.length === 0) {
        return {
            x: 0,
            y: 0
        }
    }
    return {
        x:  0,
        y: index * (context.dimensions.y)
    }
}

export const getOffset = (position: number, context: ScoreContextProperties, indexOffsetY?: number, greedy?: boolean): XY => {
    const breakpoints = context.score.data.breaks;

    let index = breakpoints.findIndex(b => greedy? position <= b : position < b);
    if (index === -1) {
        index = breakpoints.length;
    }

    return {
        x: index > 0 && breakpoints[index - 1] ? breakpoints[index - 1] * Layout.stave.note.SPACING : 0,
        y: (index + (indexOffsetY || 0)) * (context.dimensions.y),
    };
}

export const getBreakOffset = (position: number, context: ScoreContextProperties): XY => {
    const breakpoints = context.score.data.breaks;

    let index = breakpoints.findIndex(b => position === b);
    if (index === -1) {
        index = breakpoints.length;
    }
    return {
        x: index > 0 && breakpoints[index - 1] ? breakpoints[index - 1] * Layout.stave.note.SPACING : 0,
        y: index * context.dimensions.y,
    };
}

export const calculateStaveDimensions = (score: Score): StaveDimensions => {
    const bottomLineY = score.data.stave.lines.slice(-1)?.[0]?.y || 0;
    const y = Layout.stave.container.SYMBOLS_BAR
        + Layout.stave.line.SPACING * bottomLineY
        + Layout.stave.container.LYRICS_BAR;


    const distances = score.data.voices.flatMap(v => v.notes).map(n => {
        const nearestBreak = score.data.breaks.filter(p => p <= n.position).slice(-1)?.[0] || 0;
        return n.position - nearestBreak;
    })
    const x = Math.max(...distances) * Layout.stave.note.SPACING + Layout.stave.container.PADDING_X_START + Layout.stave.container.PADDING_X_END;

    // const x = Math.max(getMaxPosition(score.data.voices.flatMap(v => v.notes).map(n => n.position), score.data.breaks), 0)

    // const x = Layout.stave.container.WIDTH;
    const blocks = score.data.breaks.length + 1;

    return {
        x: Math.max(x, Layout.stave.container.MAX_WIDTH),
        y: y,
        blocks: blocks,
        containerY: y * blocks,
    };
}