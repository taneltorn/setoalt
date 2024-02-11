import React, {useMemo} from 'react';
import {Color, Layout} from "../../utils/constants";
import {Note} from "../../models/Note";
import {Voice} from "../../models/Voice";
import {useAudioContext} from "../../context/AudioContext";
import {useScoreContext} from "../../context/ScoreContext";
import {useTranslation} from "react-i18next";
import {calculateNoteCoords, isDimmed, isHighlighted} from "../../utils/stave.helpers.tsx";

interface Properties {
    note: Note;
    voice: Voice;
}

const StaveNote: React.FC<Properties> = ({note, voice}) => {

    const [t] = useTranslation();

    const audioContext = useAudioContext();
    const scoreContext = useScoreContext();

    const breaksDependency = JSON.stringify(scoreContext.score.data.breaks);

    const {x, y} = useMemo(() => {
        return calculateNoteCoords(note, voice, scoreContext);
    }, [note.pitch, note.position, note.detune, scoreContext.score.data.stave, breaksDependency]);

    return (<>
        <circle
            className={"hover-pointer"}
            cx={x}
            cy={y}
            r={Layout.stave.note.RADIUS}
            fill={isHighlighted(note, scoreContext) ? Color.stave.HIGHLIGHT : note.color || voice.color || "black"}
            opacity={isDimmed(note, voice, scoreContext, audioContext) ? Layout.stave.note.DIMMED_OPACITY : 1}
            onClick={() => scoreContext.selectNote(note)}
        >
            <title>{t(`pitch.${note.pitch.toLowerCase()}`)} </title>
        </circle>
    </>);
};

export default StaveNote;
