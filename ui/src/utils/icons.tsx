import {mdiMusicNoteEighth, mdiMusicNoteHalf, mdiMusicNoteQuarter, mdiMusicNoteSixteenth} from "@mdi/js";
import {Role} from "../context/AuthContext.tsx";
import {RiAdminFill} from "react-icons/ri";
import {FaUser} from "react-icons/fa";
import {CiUser} from "react-icons/ci";
import {GiFlute, GiGuitarHead, GiViolin} from "react-icons/gi";
import {MdOutlinePiano} from "react-icons/md";
import {BiSolidPiano} from "react-icons/bi";

export const NoteIcons = new Map([
    ["2n", mdiMusicNoteHalf],
    ["4n", mdiMusicNoteQuarter],
    ["8n", mdiMusicNoteEighth],
    ["16n", mdiMusicNoteSixteenth]
]);

export const UserIcons = new Map([
        [Role.ADMIN, <RiAdminFill size={24}/>],
        [Role.EDITOR, <FaUser size={24}/>],
        [Role.USER, <FaUser size={24}/>],
        ["guest", <CiUser size={24}/>]
    ]
);

export const InstrumentIcons = new Map([
        ["synth", <BiSolidPiano size={40}/>],
        ["piano", <MdOutlinePiano size={40}/>],
        ["violin", <GiViolin size={40}/>],
        ["flute", <GiFlute size={40}/>],
        ["guitar", <GiGuitarHead size={40}/>],
    ]
);