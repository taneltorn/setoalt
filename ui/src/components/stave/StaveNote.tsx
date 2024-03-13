import React, {useMemo} from 'react';
import {Color, Layout} from "../../utils/constants";
import {Note, NoteType} from "../../models/Note";
import {Voice} from "../../models/Voice";
import {useScoreContext} from "../../context/ScoreContext";
import {useTranslation} from "react-i18next";
import {calculateNoteCoords} from "../../utils/calculation.helpers.tsx";
import {isDimmed, isHighlighted} from "../../utils/helpers.tsx";

interface Properties {
    note: Note;
    voice: Voice;
}

const StaveNote: React.FC<Properties> = ({note, voice}) => {

    const [t] = useTranslation();
    const context = useScoreContext();

    const breaksDependency = JSON.stringify(context.score.data.breaks);

    const {x, y} = useMemo(() => {
        return calculateNoteCoords(note, voice, context);
    }, [note.pitch, note.position, note.detune, context.score.data.stave, breaksDependency]);


    return (
        <circle
            className={"hover-pointer"}
            cx={x}
            cy={y}
            r={note.type === NoteType.SMALL ? Layout.stave.note.RADIUS_SMALL : Layout.stave.note.RADIUS}
            fill={isHighlighted(note, context) ? Color.stave.HIGHLIGHT : note.color || voice.color || "black"}
            opacity={isDimmed(note, voice, context) ? Layout.stave.note.DIMMED_OPACITY : 1}
            onClick={() => context.selectNote(note)}
        >
            <title>{t(`pitch.${note.pitch.toLowerCase()}`)}</title>
        </circle>
    );
};

export default StaveNote;
