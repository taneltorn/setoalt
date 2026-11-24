import {Stave} from "../model/Stave";
import {Color} from "../utils/constants";
import {LayoutParamsLg} from "../utils/layout.tsx";

export const StaveOldDiatonic: Stave = {
    name: "OldDiatonic",
    lines: [
        {
            pitch: "c5",
            y: 0,
            color: Color.stave.SECONDARY_LINE,
            strokeWidth: LayoutParamsLg.LINE_SECONDARY_LINE_STROKE_WIDTH
        },
        {
            pitch: "b4",
            y: 1,
            color: Color.stave.PRIMARY_LINE,
            strokeWidth: LayoutParamsLg.LINE_PRIMARY_LINE_STROKE_WIDTH
        },
        {
            pitch: "a4",
            y: 3,
            color: Color.stave.SECONDARY_LINE,
            strokeWidth: LayoutParamsLg.LINE_SECONDARY_LINE_STROKE_WIDTH
        },
        {
            pitch: "g4",
            y: 5,
            color: Color.stave.PRIMARY_LINE,
            strokeWidth: LayoutParamsLg.LINE_PRIMARY_LINE_STROKE_WIDTH
        },
        {
            pitch: "f4",
            y: 7,
            color: Color.stave.SECONDARY_LINE,
            strokeWidth: LayoutParamsLg.LINE_SECONDARY_LINE_STROKE_WIDTH
        },
        {
            pitch: "e4",
            y: 9,
            color: Color.stave.PRIMARY_LINE,
            strokeWidth: LayoutParamsLg.LINE_PRIMARY_LINE_STROKE_WIDTH
        },
    ]
};