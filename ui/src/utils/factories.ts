import {Note} from "../model/Note.ts";
import {Divider, DividerType} from "../model/Divider.ts";

export const NoteFactory = {

    create: (pitch: string, position: number, duration: string): Note => {
        return {
            pitch: pitch,
            position: position > 0 ? position : 0,
            duration: duration,
        }
    }
}

export const DividerFactory = {

    create: (position: number, type: DividerType): Divider => {
        return {
            position: position > 0 ? position : 0,
            type: type,
        }
    }
}


