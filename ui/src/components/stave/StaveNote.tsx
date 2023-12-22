import React from 'react';
import {Color, Layout} from "../../utils/constants";
import {Note} from "../../models/Note";
import {Voice} from "../../models/Voice";
import {useAudioContext} from "../../context/AudioContext";
import {useScoreContext} from "../../context/ScoreContext";
import {getNoteCoords, getNoteTitle} from "../../utils/helpers.tsx";
import {useTranslation} from "react-i18next";

interface Properties {
    note: Note;
    voice: Voice;
}

const StaveNote: React.FC<Properties> = ({note, voice}) => {

    const [t] = useTranslation();

    const audioContext = useAudioContext();
    const scoreContext = useScoreContext();

    const {x, y} = getNoteCoords(note, voice, scoreContext);
    const opacity = (!audioContext.isPlaying
        && scoreContext.isEditMode
        && voice.name !== scoreContext.currentVoice.name) ? 0.4 : 1;

    const isHighlighted = scoreContext.currentPosition === note.position
        && (!scoreContext.currentNote
            || !scoreContext.isEditMode
            || scoreContext.currentVoice?.name === voice.name);

    const line = scoreContext.score.data.stave.lines.find(l => l.pitch === note.pitch);

    const handleNoteClick = () => {
        scoreContext.setCurrentPosition(note.position);
        scoreContext.setCurrentNote(note);
        scoreContext.setCurrentDuration(note.duration);
        scoreContext.setCurrentVoice(voice);

        audioContext.stopPlayback();

        audioContext.playNote(note, voice, note.detune || line?.detune, scoreContext.semitones);
    }

    return (<>
        {/*{Layout.stave.note.SHAPE === 1 &&*/}
        {/*    <rect*/}
        {/*        rx={7}*/}
        {/*        className={"hover-pointer"}*/}
        {/*        width={Layout.stave.note.SPACING * durationToScalar(note.duration) - 18}*/}
        {/*        height={Layout.stave.note.RADIUS * 2}*/}
        {/*        x={((note.position || 0) * Layout.stave.note.SPACING + (note.noteXOffset || 0) + Layout.stave.PADDING_X_START)}*/}
        {/*        y={line.y - Layout.stave.note.RADIUS}*/}
        {/*        fill={*/}
        {/*            isHighlighted*/}
        {/*                ? Color.stave.HIGHLIGHT*/}
        {/*                : note.color || voice.color}*/}
        {/*        onClick={handleNoteClick}*/}
        {/*    />}*/}

        <circle
            className={"hover-pointer"}
            cx={x}
            cy={y}
            opacity={opacity}
            r={Layout.stave.note.RADIUS}
            fill={isHighlighted ? Color.stave.HIGHLIGHT : !line ? "#ddd" : note.color || voice.color}
            onClick={handleNoteClick}
        >
            <title>{getNoteTitle(note, line, t)}</title>
        </circle>
    </>);
};

export default StaveNote;
