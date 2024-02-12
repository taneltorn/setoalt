import {Voice} from "../models/Voice.ts";
import {ScoreContextProperties} from "../context/ScoreContext.tsx";
import {Layout} from "./constants.ts";
import {Note} from "../models/Note.ts";
import {XY} from "../models/XY.ts";
import {Divider} from "../models/Divider.ts";
import {Score} from "../models/Score.ts";
import {StaveDimensions} from "../models/Dimensions.ts";

export const calculateBreakCoords = (position: number, context: ScoreContextProperties): XY => {
    console.log("calculating break at " + position)

    const offset = getBreakOffset(position, context);
    const x = Layout.stave.container.PADDING_X_START
        + position * Layout.stave.note.SPACING
        - Layout.stave.note.RADIUS
        - offset.x;

    const y = Layout.stave.container.SYMBOLS_BAR
        + offset.y;

    return {x: x, y: y};
}

export const calculateDividerCoords = (divider: Divider, context: ScoreContextProperties): XY => {
    // console.log("calculating divider for divider at " + divider.position)

    const offset = getOffset(divider.position, context);

    const x = Layout.stave.container.PADDING_X_START
        + divider.position * Layout.stave.note.SPACING
        - Layout.stave.note.RADIUS
        - Layout.stave.divider.WIDTH
        - Layout.stave.note.SPACING / 2
        - offset.x;

    const y = Layout.stave.container.SYMBOLS_BAR
        + offset.y;

    return {x: x, y: y};
}

export const calculateCurrentPositionCoords = (context: ScoreContextProperties): XY => {
    // console.log("calculating current position at " + context.currentPosition)

    const offset = getOffset(context.currentPosition, context);

    const x = Layout.stave.container.PADDING_X_START
        + context.currentPosition * Layout.stave.note.SPACING
        - Layout.stave.cursor.WIDTH / 2
        - Layout.stave.note.RADIUS / 2
        - offset.x;

    const y = offset.y + 10;

    return {x: x, y: y};
}

export const calculateCursorCoords = (context: ScoreContextProperties): XY => {
    // console.log("calculating cursor corrs at " + context.currentPosition)

    const offset = getOffset(context.cursorPosition, context);

    const x = Layout.stave.container.PADDING_X_START
        + context.cursorPosition * Layout.stave.note.SPACING
        - Layout.stave.cursor.WIDTH / 2
        - Layout.stave.note.RADIUS / 2
        - offset.x;

    const y = offset.y + 10;

    return {x: x, y: y};
}

export const calculateNoteCoords = (note: Note, voice: Voice, context: ScoreContextProperties): XY => {
    // console.log("calculating coords for note at " + note.position)

    const offset = getOffset(note.position, context);

    const positionOccupied = context.score.data.voices
        .filter(v => v.color !== voice.color)
        .flatMap(v => v.notes)
        .find(n => n.position === note.position && n.pitch === note.pitch);
    if (positionOccupied) {
        offset.x -= Layout.stave.note.REPEATING_OFFSET;
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

export const calculateCursorNoteCoords = (pitch: string, cursorX: number, cursorY: number, context: ScoreContextProperties): XY => {
    const line = context.score.data.stave.lines.find(l => l.pitch === pitch);
    if (line) {
        const x = cursorX + Layout.stave.cursor.WIDTH / 2;
        const y = cursorY
            + Layout.stave.container.SYMBOLS_BAR
            + ((line?.y || 0) - (line.detune || 0) / 100) * Layout.stave.line.SPACING
            - Layout.stave.cursor.Y_OFFSET;
        return {
            x, y
        }
    }
    return {x: 0, y: 0}
}

export const calculateLineBlockOffset = (index: number, context: ScoreContextProperties): XY => {
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

    const x = Layout.stave.container.WIDTH;

    return {
        x: x,
        y: y,
        blocks: score.data.breaks.length + 1,
    };
}