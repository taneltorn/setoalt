import {Stave} from "../models/Stave";
import {Color, Layout} from "../utils/constants";

export const StaveOldDiatonic: Stave = {
    name: "OldDiatonic",
    lines: [
        {
            pitch: "c5",
            y: 0,
            color: Color.stave.SECONDARY_LINE,
            strokeWidth: Layout.stave.line.SECONDARY_LINE_STROKE_WIDTH
        },
        {
            pitch: "b4",
            y: 1,
            color: Color.stave.PRIMARY_LINE,
            strokeWidth: Layout.stave.line.PRIMARY_LINE_STROKE_WIDTH
        },
        {
            pitch: "a4",
            y: 3,
            color: Color.stave.SECONDARY_LINE,
            strokeWidth: Layout.stave.line.SECONDARY_LINE_STROKE_WIDTH
        },
        {
            pitch: "g4",
            y: 5,
            color: Color.stave.PRIMARY_LINE,
            strokeWidth: Layout.stave.line.STROKE_WIDTH_BOLD
        },
        {
            pitch: "f4",
            y: 7,
            color: Color.stave.SECONDARY_LINE,
            strokeWidth: Layout.stave.line.SECONDARY_LINE_STROKE_WIDTH
        },
        {
            pitch: "e4",
            y: 8,
            color: Color.stave.PRIMARY_LINE,
            strokeWidth: Layout.stave.line.PRIMARY_LINE_STROKE_WIDTH
        },
    ]
};