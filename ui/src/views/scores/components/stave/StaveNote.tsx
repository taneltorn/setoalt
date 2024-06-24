import React, {useMemo} from 'react';
import {useTranslation} from "react-i18next";
import {Note, NoteType} from "../../../../model/Note.ts";
import {useScoreContext} from "../../../../context/ScoreContext.tsx";
import {Voice} from "../../../../model/Voice.ts";
import {calculateNoteCoords, calculateNoteOpacity} from "../../../../utils/calculation.helpers.tsx";
import {Color, Layout} from "../../../../utils/constants.ts";
import {isHighlighted} from "../../../../utils/helpers.tsx";
import DetuneIndicator from "./DetuneIndicator.tsx";

interface Properties {
    note: Note;
    voice: Voice;
}

const StaveNote: React.FC<Properties> = ({note, voice}) => {

    const [t] = useTranslation();
    const context = useScoreContext();
    const breaksDependency = JSON.stringify(context.score.data.breaks);
    const voicesDependency = JSON.stringify(context.score.data.voices);

    const {x, y} = useMemo(() => {
        return calculateNoteCoords(note, voice, context);
    }, [note.pitch, note.position, note.detune, context.score.data.stave, breaksDependency]);

    const opacity = useMemo(() => {
        return calculateNoteOpacity(note, voice, context);
    }, [context.activeVoice, context.duplicateNoteKeys, voicesDependency, context.loopRange]);

    const color = isHighlighted(note, context) ? Color.stave.HIGHLIGHT : note.color || voice.color || "black";

    return (
        <>
            <circle
                className={"hover-pointer"}
                cx={x}
                cy={y}
                r={note.type === NoteType.SMALL ? Layout.stave.note.RADIUS_SMALL : Layout.stave.note.RADIUS}
                fill={isHighlighted(note, context) ? Color.stave.HIGHLIGHT : note.color || voice.color || "black"}
                opacity={opacity}
            >
                <title>{t(`pitch.${note.pitch.toLowerCase()}`)}</title>
            </circle>
            {note.detune && note.showDetuneIndicator &&
                <DetuneIndicator
                    detune={note.detune}
                    x={x}
                    y={y}
                    opacity={opacity}
                    color={color}
                />}
        </>
    );
};

export default StaveNote;
