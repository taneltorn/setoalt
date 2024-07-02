import {mdiMusicNoteEighth, mdiMusicNoteHalf, mdiMusicNoteQuarter, mdiMusicNoteSixteenth} from "@mdi/js";
import {GiFlute, GiGuitarHead, GiViolin} from "react-icons/gi";
import {
    MdOutlineFormatTextdirectionLToR,
    MdOutlineFormatTextdirectionRToL,
    MdOutlinePiano
} from "react-icons/md";
import {BiSolidPiano} from "react-icons/bi";
import {Size} from "./constants.ts";
import {GoArrowLeft, GoArrowRight} from "react-icons/go";
import {ShiftMode} from "./enums.ts";
import {TfiShiftLeft, TfiShiftRight} from "react-icons/tfi";

export const NoteIcons = new Map([
    ["2n", mdiMusicNoteHalf],
    ["4n", mdiMusicNoteQuarter],
    ["8n", mdiMusicNoteEighth],
    ["16n", mdiMusicNoteSixteenth]
]);

export const InstrumentIcons = new Map([
        ["synth", <BiSolidPiano size={Size.icon.MD}/>],
        ["piano", <MdOutlinePiano size={Size.icon.MD}/>],
        ["violin", <GiViolin size={Size.icon.MD}/>],
        ["flute", <GiFlute size={Size.icon.MD}/>],
        ["guitar", <GiGuitarHead size={Size.icon.MD}/>],
    ]
);


export const ShiftLeftIcons = new Map([
        [ShiftMode.NOTES, <GoArrowLeft size={Size.icon.SM}/>],
        [ShiftMode.LYRICS, <MdOutlineFormatTextdirectionRToL size={Size.icon.SM}/>],
        [ShiftMode.VOICES, <TfiShiftLeft size={Size.icon.SM}/>],
    ]
);

export const ShiftRightIcons = new Map([
        [ShiftMode.NOTES, <GoArrowRight size={Size.icon.SM}/>],
        [ShiftMode.LYRICS, <MdOutlineFormatTextdirectionLToR size={Size.icon.SM}/>],
        [ShiftMode.VOICES, <TfiShiftRight size={Size.icon.SM}/>],
    ]
);

