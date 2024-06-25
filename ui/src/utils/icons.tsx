import {mdiMusicNoteEighth, mdiMusicNoteHalf, mdiMusicNoteQuarter, mdiMusicNoteSixteenth} from "@mdi/js";
import {GiFlute, GiGuitarHead, GiViolin} from "react-icons/gi";
import {MdOutlinePiano} from "react-icons/md";
import {BiSolidPiano} from "react-icons/bi";
import {Size} from "./constants.ts";

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