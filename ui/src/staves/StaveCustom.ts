import {Stave} from "../model/Stave";
import {Color} from "../utils/constants";
import {DefaultLayoutParams} from "../utils/layout.tsx";

export const StaveCustom: Stave = {
    name: "Custom",
    lines: [
        {
            pitch: "c5",
            y: 0,
            color: Color.stave.PRIMARY_LINE,
            strokeWidth: DefaultLayoutParams.LINE_PRIMARY_LINE_STROKE_WIDTH
        } ,
        {
            pitch: "g4",
            y: 2,
            color: Color.stave.PRIMARY_LINE,
            strokeWidth: DefaultLayoutParams.LINE_PRIMARY_LINE_STROKE_WIDTH
        } ,
        {
            pitch: "e4",
            y: 4,
            color: Color.stave.PRIMARY_LINE,
            strokeWidth: DefaultLayoutParams.LINE_PRIMARY_LINE_STROKE_WIDTH
        },
        {
            pitch: "c4",
            y: 6,
            color: Color.stave.PRIMARY_LINE,
            strokeWidth: DefaultLayoutParams.LINE_PRIMARY_LINE_STROKE_WIDTH
        },
    ]
};