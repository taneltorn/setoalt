import {Voice} from "../models/Voice.ts";
import {AudioContextProperties} from "../context/AudioContext.tsx";
import {ScoreContextProperties} from "../context/ScoreContext.tsx";
import {Layout} from "./constants.ts";
import {Note} from "../models/Note.ts";
import {XY} from "../models/XY.ts";
import {getBreakCount, getBreakOffset, getOffset} from "./helpers.tsx";
import {Divider} from "../models/Divider.ts";

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

export const calculateCursorCoords = (context: ScoreContextProperties): XY => {
    console.log("calculating cursor corrs at " + context.currentPosition)

    const offset = getOffset(context.currentPosition, context);

    const x = Layout.stave.container.PADDING_X_START
        + context.currentPosition * Layout.stave.note.SPACING
        - Layout.stave.cursor.WIDTH / 2
        - Layout.stave.note.RADIUS / 2
        - offset.x;

    const y = Layout.stave.container.SYMBOLS_BAR
        + offset.y;

    return {x: x, y: y};

    // const c = getBreakCount(context.currentPosition, context.score.data.dividers);
    //
    // const x = context.currentPosition * Layout.stave.note.SPACING
    //     + Layout.stave.container.PADDING_X_START
    //     - (c > 0 ? context.score.data.dividers[c - 1].position * Layout.stave.note.SPACING : 0)
    //     - Layout.stave.cursor.WIDTH / 2
    //     - Layout.stave.note.RADIUS / 2
    // ;
    // const y = context.dimensions.y * c - 30;
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


export const isDimmed = (note: Note, voice: Voice, scoreContext: ScoreContextProperties, audioContext: AudioContextProperties) => {
    return  !scoreContext.score.data.stave.lines.find(l => l.pitch === note.pitch) ||
    !audioContext.isPlaying && scoreContext.isEditMode && !!scoreContext.filter.voices?.length && !scoreContext.filter.voices.includes(voice.name);
}

export const isHighlighted = (note: Note, context: ScoreContextProperties) => {
    // return context.currentPosition === note.position;
   // return context.highlightedNotes.find(n => n.position === note.position && n.pitch === note.pitch);
   return  context.currentPosition === note.position  && context.currentNote?.pitch === note.pitch;
        // && (!context.currentNote
        //     || !context.isEditMode
        //     || context.currentVoice?.name === voice.name);
    // return context.highlightedNotes.find(n => n.position === note.position && n.pitch === note.pitch);
}
