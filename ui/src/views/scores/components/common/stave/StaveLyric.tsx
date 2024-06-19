import React, {useMemo, useState} from 'react';
import {Color, Layout} from "../../../../../utils/constants.ts";
import {useAudioContext} from "../../../../../context/AudioContext.tsx";
import {useScoreContext} from "../../../../../context/ScoreContext.tsx";
import {Lyric} from "../../../../../models/Lyric.ts";
import {calculateLyricCoords} from "../../../../../utils/calculation.helpers.tsx";

interface Properties {
    lyric: Lyric;
}

const StaveLyric: React.FC<Properties> = ({lyric}) => {

    const audioContext = useAudioContext();
    const scoreContext = useScoreContext();

    const [value, setValue] = useState<string>(lyric.text);
    const breaksDependency = JSON.stringify(scoreContext.score.data.breaks);

    const {x, y} = useMemo(() => {
        return calculateLyricCoords(lyric, scoreContext);
    }, [lyric.position, scoreContext.score.data.stave, breaksDependency]);


    const handleNoteClick = () => {
        audioContext.stopPlayback();
        audioContext.playPosition(scoreContext.score, lyric.position, undefined, {transpose: scoreContext.semitones});

        const notes = scoreContext.getNotes(lyric.position);

        scoreContext.setCurrentNote(notes.length === 1 ? notes[0] : undefined);
        scoreContext.setCurrentPosition(lyric.position);
    }

    const handleChange = (value: string) => {
        setValue(value);
    }

    const save = () => {
        const l = scoreContext.score.data.lyrics.find(l => l.position === lyric.position);
        if (l) {
            if (value) {
                l.text = value;
            } else {
                scoreContext.score.data.lyrics = scoreContext.score.data.lyrics.filter(l => l.position !== lyric.position);
            }
        } else {
            if (value) {
                scoreContext.score.data.lyrics.push({
                    text: value,
                    position: lyric.position
                });
            }
        }
        scoreContext.refresh();
        scoreContext.setIsTyping(false);
    }

    return (<>
            {scoreContext.isEditMode && !scoreContext.isExportMode &&
                <foreignObject key={`lyric-${lyric.position}`} x={x - 20} y={y} width={Layout.stave.note.SPACING} height="40">
                    <input
                        onFocus={() => scoreContext.setIsTyping(true)}
                        onBlur={() => save()}
                        className={`lyric-input`}
                        disabled={!scoreContext.isEditMode}
                        value={value}
                        style={{width: Layout.stave.note.SPACING, fontWeight: Layout.stave.lyrics.FONT_WEIGHT, fontSize: Layout.stave.lyrics.FONT_SIZE}}
                        onChange={e => handleChange(e.target.value)}
                    />
                </foreignObject>}

            {(!scoreContext.isEditMode || scoreContext.isExportMode) &&
                <text
                    className="hover-pointer"
                    fill={lyric.position === scoreContext.currentPosition && !scoreContext.isExportMode ? Color.stave.HIGHLIGHT : Color.stave.LYRICS}
                    fontWeight={Layout.stave.lyrics.FONT_WEIGHT}
                    fontSize={Layout.stave.lyrics.FONT_SIZE}
                    x={x}
                    y={y}
                    onClick={handleNoteClick}
                >{lyric.text}</text>}
        </>
    )
};

export default StaveLyric;
