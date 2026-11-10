import {Voice, VoiceType} from "../model/Voice.ts";
import {Note} from "../model/Note.ts";
import {XY} from "../model/XY.ts";
import {Divider} from "../model/Divider.ts";
import {Score} from "../model/Score.ts";
import {StaveDimensions} from "../model/Dimensions.ts";
import {Lyric} from "../model/Lyric.ts";
import {Range} from "../model/Range.ts";
import {ScoreContextProperties} from "../context/ScoreContext.tsx";
import {LayoutParams} from "../model/LayoutParams.ts";

// todo: could refactor a lot here

export const calculateBreakCoords = (position: number, context: ScoreContextProperties, params: LayoutParams): XY => {
    const offset = getBreakOffset(position, context, params);
    const x = params.CONTAINER_PADDING_X_START
        + position * params.NOTE_SPACING
        - offset.x;

    const y = params.CONTAINER_SYMBOLS_BAR / 2
        + offset.y;

    return {x: x, y: y};
}

export const calculateDividerCoords = (divider: Divider, context: ScoreContextProperties, params: LayoutParams): XY => {
    const offset = getOffset(divider.position, context.score.data.breaks, context.dimensions, params, 0, true);

    const x = params.CONTAINER_PADDING_X_START
        + divider.position * params.NOTE_SPACING
        - params.NOTE_RADIUS
        - params.DIVIDER_WIDTH
        - params.NOTE_SPACING / 2
        - offset.x;

    const y = params.CONTAINER_SYMBOLS_BAR
        + offset.y
        - params.DIVIDER_SEPARATOR_HEIGHT / 2;

    return {x: x, y: y};
}

export const calculateLoopRangeCoords = (context: ScoreContextProperties, params: LayoutParams): XY[] => {
    if (!context.loopRange) {
        return [{x: 0, y: 0}, {x: 0, y: 0}];
    }
    const startOffset = getOffset(context.loopRange.start, context.score.data.breaks, context.dimensions, params, 0, true);
    const endOffset = getOffset(context.loopRange.end, context.score.data.breaks, context.dimensions, params, 0, true);

    const startX = params.CONTAINER_PADDING_X_START
        + context.loopRange.start * params.NOTE_SPACING
        - params.NOTE_RADIUS * 3
        - startOffset.x;

    const startY = params.CONTAINER_SYMBOLS_BAR
        + startOffset.y
        - params.DIVIDER_SEPARATOR_HEIGHT / 2;

    const endX = params.CONTAINER_PADDING_X_START
        + context.loopRange.end * params.NOTE_SPACING
        + params.NOTE_RADIUS * 1.5
        - endOffset.x;

    const endY = params.CONTAINER_SYMBOLS_BAR
        + endOffset.y
        - params.DIVIDER_SEPARATOR_HEIGHT / 2;

    return [{x: startX, y: startY}, {x: endX, y: endY}];
}

export const calculateLyricCoords = (lyric: Lyric, context: ScoreContextProperties, params: LayoutParams): XY => {
    const offset = getOffset(lyric.position, context.score.data.breaks, context.dimensions, params);

    const x = params.CONTAINER_PADDING_X_START
        + lyric.position * params.NOTE_SPACING
        - params.NOTE_RADIUS * 1.8
        - offset.x;

    const y = context.dimensions.y
        - params.CONTAINER_LYRICS_BAR / 2
        + offset.y;

    return {x: x, y: y};
}

export const calculateNoteCoords = (note: Note, voice: Voice, context: ScoreContextProperties, params: LayoutParams): XY => {
    const offset = getOffset(note.position, context.score.data.breaks, context.dimensions, params);

    if (voice.type === VoiceType.KILLO || voice.type === VoiceType.FRONT) {
        const positionOccupied = context.score.data.voices
            .filter(v => v.type !== voice.type && !voice.hidden)
            .flatMap(v => v.notes)
            .filter(n => n.position === note.position && n.pitch === note.pitch);
        if (positionOccupied.length > 0) {
            offset.x -= params.NOTE_REPEATING_OFFSET;
        }
    }

    const x = params.CONTAINER_PADDING_X_START
        + note.position * params.NOTE_SPACING
        - params.NOTE_RADIUS / 2
        - offset.x;

    const line = context.score.data.stave.lines.find(l => l.pitch === note.pitch);
    // const detune = note.detune || line?.detune || 0;                     // if microtonality should affect y

    const y = params.CONTAINER_SYMBOLS_BAR
        // + ((line?.y || 0) - detune / 100) * params.LINE_SPACING    // if microtonality should affect y
        + (line?.y || 0) * params.LINE_SPACING
        + offset.y;

    return {x: x, y: y};
}

export const getNoteBaseKey = (note: Note, voice: Voice) => {
    return `${note.position}-${note.pitch}-${voice.type === VoiceType.BOTTOM_TORRO ? VoiceType.TORRO : voice.type}-${voice.hidden}`;
}

export const isInsideLoop = (position: number, loopRange?: Range): boolean | undefined => {
    if (!loopRange) {
        return undefined;
    }
    return position >= loopRange.start && position <= loopRange.end;
}

export const calculateNoteOpacity = (note: Note, voice: Voice, context: ScoreContextProperties): number => {
    if (context.loopRange) {
        return isInsideLoop(note.position, context.loopRange) ? 1 : 0.1;
    }

    if (voice.name === context.activeVoice) {
        return 1;
    }

    const key = `${getNoteBaseKey(note, voice)}-${voice.name}`;
    if (context.duplicateNoteKeys.includes(`${key}`)) {
        return 0;
    }

    if (!voice.hidden) {
        return 1
    }

    return context.duplicateNoteKeys.includes(key)
        ? 0
        : (context.isEditMode ? 0.1 : 0);
}

export const calculateCurrentPositionCoords = (context: ScoreContextProperties, params: LayoutParams): XY => {
    const offset = getOffset(context.activePosition, context.score.data.breaks, context.dimensions, params);

    const x = params.CONTAINER_PADDING_X_START
        + context.activePosition * params.NOTE_SPACING
        - params.CURSOR_WIDTH / 2
        - params.NOTE_RADIUS / 2
        - offset.x;

    const y = offset.y;

    return {x: x, y: y};
}

export const calculateCursorCoords = (context: ScoreContextProperties, params: LayoutParams): XY => {
    const offset = getOffset(context.cursorPosition, context.score.data.breaks, context.dimensions, params);

    const x = params.CONTAINER_PADDING_X_START
        + context.cursorPosition * params.NOTE_SPACING
        - params.CURSOR_WIDTH / 2
        - params.NOTE_RADIUS / 2
        - offset.x;

    const y = offset.y;

    return {x: x, y: y};
}


export const calculateCursorNoteCoords = (pitch: string, cursorX: number, cursorY: number, context: ScoreContextProperties, params: LayoutParams): XY => {
    const line = context.score.data.stave.lines.find(l => l.pitch === pitch);
    if (line) {
        const x = cursorX + params.CURSOR_WIDTH / 2;
        const y = cursorY
            + params.CONTAINER_SYMBOLS_BAR
            + (line?.y || 0) * params.LINE_SPACING
        // - params.CURSOR_Y_OFFSET;
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
        x: 0,
        y: index * (context.dimensions.y)
    }
}

export const getOffset = (position: number, breaks: number[], dimensions: StaveDimensions, params: LayoutParams, indexOffsetY?: number, greedy?: boolean): XY => {
    let index = breaks.findIndex(b => greedy ? position <= b : position < b);
    if (index === -1) {
        index = breaks.length;
    }

    return {
        x: index > 0 && breaks[index - 1] ? breaks[index - 1] * params.NOTE_SPACING : 0,
        y: (index + (indexOffsetY || 0)) * (dimensions.y),
    };
}

export const getBreakOffset = (position: number, context: ScoreContextProperties, params: LayoutParams): XY => {
    const breakpoints = context.score.data.breaks;

    let index = breakpoints.findIndex(b => position === b);
    if (index === -1) {
        index = breakpoints.length;
    }
    return {
        x: index > 0 && breakpoints[index - 1] ? breakpoints[index - 1] * params.NOTE_SPACING : 0,
        y: index * context.dimensions.y,
    };
}

export const calculateStaveDimensions = (score: Score, params: LayoutParams): StaveDimensions => {
    const bottomLineY = score.data.stave.lines.slice(-1)?.[0]?.y || 0;
    const y = params.CONTAINER_SYMBOLS_BAR
        + params.LINE_SPACING * bottomLineY
        + params.CONTAINER_LYRICS_BAR;


    const distances = score.data.voices.flatMap(v => v.notes).map(n => {
        const nearestBreak = score.data.breaks.filter(p => p <= n.position).slice(-1)?.[0] || 0;
        return n.position - nearestBreak;
    });

    //todo include dividers and breaks
    const x = Math.max(...distances) * params.NOTE_SPACING + params.CONTAINER_PADDING_X_START + params.CONTAINER_PADDING_X_END;

    const blocks = score.data.breaks.length + 1;

    return {
        x: Math.min(Math.max(x + 250, params.CONTAINER_MIN_WIDTH), params.CONTAINER_MAX_WIDTH),
        y: y,
        blocks: blocks,
        containerY: y * blocks,
    };
}

export const calculateEmbeddingHeight = (score: Score, params: LayoutParams): number => {
    return (score.data.breaks.length || 0) * params.EMBEDDING_ROW + params.EMBEDDING_BASE;
}