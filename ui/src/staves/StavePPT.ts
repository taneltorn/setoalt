import {Stave} from "../models/Stave";
import {Color, Layout} from "../utils/constants";

export const StavePPT: Stave = {
    name: "PPT",
    lines: [
        {
            pitch: "b4",
            "y": 0,
            color: Color.stave.SECONDARY_LINE,
            strokeWidth: Layout.stave.line.SECONDARY_LINE_STROKE_WIDTH
        },
        {
            pitch: "a#4",
            y: 1,
            color: Color.stave.PRIMARY_LINE,
            strokeWidth: Layout.stave.line.PRIMARY_LINE_STROKE_WIDTH
        },
        {
            pitch: "g4",
            y: 4,
            color: Color.stave.SECONDARY_LINE,
            strokeWidth: Layout.stave.line.SECONDARY_LINE_STROKE_WIDTH
        },
        {
            pitch: "f#4",
            y: 5,
            color: Color.stave.PRIMARY_LINE,
            strokeWidth: Layout.stave.line.PRIMARY_LINE_STROKE_WIDTH
        },
        {
            pitch: "d#4",
            y: 8,
            color: Color.stave.SECONDARY_LINE,
            strokeWidth: Layout.stave.line.SECONDARY_LINE_STROKE_WIDTH
        },
        {
            pitch: "d4",
            y: 9,
            color: Color.stave.PRIMARY_LINE,
            strokeWidth: Layout.stave.line.PRIMARY_LINE_STROKE_WIDTH
        },
    ]
};