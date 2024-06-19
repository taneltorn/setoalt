import {Stave} from "../models/Stave";
import {Color, Layout} from "../utils/constants";

export const StaveTest: Stave = {
    name: "Test",
    lines: [
        {
            pitch: "b4",
            y: 0,
            color: Color.stave.PRIMARY_LINE,
            strokeWidth: Layout.stave.line.PRIMARY_LINE_STROKE_WIDTH
        },
        {
            pitch: "a#4",
            y: 1,
            color: Color.stave.PRIMARY_LINE,
            strokeWidth: Layout.stave.line.PRIMARY_LINE_STROKE_WIDTH
        },
        {
            pitch: "g4",
            y: 2,
            color: Color.stave.PRIMARY_LINE,
            strokeWidth: Layout.stave.line.PRIMARY_LINE_STROKE_WIDTH
        }
    ]
};