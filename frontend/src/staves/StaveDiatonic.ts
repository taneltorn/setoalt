import {Stave} from "../models/Stave";
import {Color, Layout} from "../utils/constants";

export const StaveDiatonic: Stave = {
    name: "Diatonic",
    lines: [
        {
            pitch: "e5",
            y: 0,
            color: Color.stave.SECONDARY_LINE,
            strokeWidth: Layout.stave.line.SECONDARY_LINE_STROKE_WIDTH
        },
        {
            pitch: "d#5",
            y: 1,
            color: Color.stave.PRIMARY_LINE,
            strokeWidth: Layout.stave.line.PRIMARY_LINE_STROKE_WIDTH
        },
        {
            pitch: "c#5",
            y: 3,
            color: Color.stave.SECONDARY_LINE,
            strokeWidth: Layout.stave.line.SECONDARY_LINE_STROKE_WIDTH
        },
        {
            pitch: "b4",
            y: 5,
            color: Color.stave.PRIMARY_LINE,
            strokeWidth: Layout.stave.line.STROKE_WIDTH_BOLD
        },
        {
            pitch: "a#4",
            y: 6,
            color: Color.stave.SECONDARY_LINE,
            strokeWidth: Layout.stave.line.SECONDARY_LINE_STROKE_WIDTH
        },
        {
            pitch: "g#4",
            y: 8,
            color: Color.stave.PRIMARY_LINE,
            strokeWidth: Layout.stave.line.PRIMARY_LINE_STROKE_WIDTH
        },
        {
            pitch: "f#4",
            y: 10,
            color: Color.stave.SECONDARY_LINE,
            strokeWidth: Layout.stave.line.SECONDARY_LINE_STROKE_WIDTH
        },
    ]
};