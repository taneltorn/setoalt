import {Voice, VoiceType} from "../model/Voice.ts";
import {Layout} from "./constants.ts";
import {Note} from "../model/Note.ts";
import {XY} from "../model/XY.ts";
import {Divider} from "../model/Divider.ts";
import {Score} from "../model/Score.ts";
import {StaveDimensions} from "../model/Dimensions.ts";
import {Lyric} from "../model/Lyric.ts";
import {Range} from "../model/Range.ts";
import {ScoreContextProperties} from "../context/ScoreContext.tsx";

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
    const offset = getOffset(divider.position, context.score.data.breaks, context.dimensions, 0, true);

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

export const calculateLoopRangeCoords = (context: ScoreContextProperties): XY[] => {
    if (!context.loopRange) {
        return [{x: 0, y: 0}, {x: 0, y: 0}];
    }
    const startOffset = getOffset(context.loopRange.start, context.score.data.breaks, context.dimensions, 0, true);
    const endOffset = getOffset(context.loopRange.end, context.score.data.breaks, context.dimensions, 0, true);

    const startX = Layout.stave.container.PADDING_X_START
        + context.loopRange.start * Layout.stave.note.SPACING
        - Layout.stave.note.RADIUS * 3
        - startOffset.x;

    const startY = Layout.stave.container.SYMBOLS_BAR
        + startOffset.y
        - Layout.stave.divider.SEPARATOR_HEIGHT / 2;

    const endX = Layout.stave.container.PADDING_X_START
        + context.loopRange.end * Layout.stave.note.SPACING
        + Layout.stave.note.RADIUS * 1.5
        - endOffset.x;

    const endY = Layout.stave.container.SYMBOLS_BAR
        + endOffset.y
        - Layout.stave.divider.SEPARATOR_HEIGHT / 2;

    return [{x: startX, y: startY}, {x: endX, y: endY}];
}

export const calculateLyricCoords = (lyric: Lyric, context: ScoreContextProperties): XY => {
    const offset = getOffset(lyric.position, context.score.data.breaks, context.dimensions);

    const x = Layout.stave.container.PADDING_X_START
        + lyric.position * Layout.stave.note.SPACING
        - Layout.stave.note.RADIUS * 1.8
        - offset.x;

    const y = context.dimensions.y
        - Layout.stave.container.LYRICS_BAR / 2
        + offset.y;

    return {x: x, y: y};
}

export const calculateNoteCoords = (note: Note, voice: Voice, context: ScoreContextProperties): XY => {
    const offset = getOffset(note.position, context.score.data.breaks, context.dimensions);

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
    // const detune = note.detune || line?.detune || 0;                     // if microtonality should affect y

    const y = Layout.stave.container.SYMBOLS_BAR
        // + ((line?.y || 0) - detune / 100) * Layout.stave.line.SPACING    // if microtonality should affect y
        + (line?.y || 0) * Layout.stave.line.SPACING
        + offset.y;

    return {x: x, y: y};
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

    const key = `${note.position}-${note.pitch}-${voice.type === VoiceType.BOTTOM_TORRO ? VoiceType.TORRO : voice.type}-${voice.name}`;
    if (context.duplicateNoteKeys.includes(key)) {
        return 0;
    }

    if (!voice.hidden) {
        return 1
    }

    return context.duplicateNoteKeys.includes(key)
        ? 0
        : (context.isEditMode ? 0.1 : 0);
}

export const calculateCurrentPositionCoords = (context: ScoreContextProperties): XY => {
    const offset = getOffset(context.activePosition, context.score.data.breaks, context.dimensions);

    const x = Layout.stave.container.PADDING_X_START
        + context.activePosition * Layout.stave.note.SPACING
        - Layout.stave.cursor.WIDTH / 2
        - Layout.stave.note.RADIUS / 2
        - offset.x;

    const y = offset.y;

    return {x: x, y: y};
}

export const calculateCursorCoords = (context: ScoreContextProperties): XY => {
    const offset = getOffset(context.cursorPosition, context.score.data.breaks, context.dimensions);

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
        x: 0,
        y: index * (context.dimensions.y)
    }
}

export const getOffset = (position: number, breaks: number[], dimensions: StaveDimensions, indexOffsetY?: number, greedy?: boolean): XY => {
    let index = breaks.findIndex(b => greedy ? position <= b : position < b);
    if (index === -1) {
        index = breaks.length;
    }

    return {
        x: index > 0 && breaks[index - 1] ? breaks[index - 1] * Layout.stave.note.SPACING : 0,
        y: (index + (indexOffsetY || 0)) * (dimensions.y),
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

    const blocks = score.data.breaks.length + 1;

    return {
        x: Math.max(x, Layout.stave.container.MAX_WIDTH),
        y: y,
        blocks: blocks,
        containerY: y * blocks,
    };
}