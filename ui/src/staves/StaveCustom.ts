import {Stave} from "../model/Stave";
import {Color, Layout} from "../utils/constants";

export const StaveCustom: Stave = {
    name: "Custom",
    lines: [
        {
            pitch: "c5",
            y: 0,
            color: Color.stave.PRIMARY_LINE,
            strokeWidth: Layout.stave.line.PRIMARY_LINE_STROKE_WIDTH
        } ,
        {
            pitch: "g4",
            y: 2,
            color: Color.stave.PRIMARY_LINE,
            strokeWidth: Layout.stave.line.PRIMARY_LINE_STROKE_WIDTH
        } ,
        {
            pitch: "e4",
            y: 4,
            color: Color.stave.PRIMARY_LINE,
            strokeWidth: Layout.stave.line.PRIMARY_LINE_STROKE_WIDTH
        },
        {
            pitch: "c4",
            y: 6,
            color: Color.stave.PRIMARY_LINE,
            strokeWidth: Layout.stave.line.PRIMARY_LINE_STROKE_WIDTH
        },
    ]
};