import React, {useState} from 'react';
import {Color, Layout} from "../../utils/constants";
import {useAudioContext} from "../../context/AudioContext";
import {useScoreContext} from "../../context/ScoreContext";
import {Lyric} from "../../models/Lyric";
import {getLyricCoords} from "../../utils/helpers";
import {Input} from "@mantine/core";

interface Properties {
    lyric: Lyric;
}

const StaveLyric: React.FC<Properties> = ({lyric}) => {

    const audioContext = useAudioContext();
    const scoreContext = useScoreContext();

    const [value, setValue] = useState<string>(lyric.text);
    const {x, y} = getLyricCoords(lyric.position, scoreContext);

    const handleNoteClick = () => {
        audioContext.stopPlayback();
        audioContext.playPosition(scoreContext.score, lyric.position, undefined, scoreContext.semitones);

        const notes = scoreContext.getNotes(lyric.position);

        scoreContext.setCurrentNote(notes.length === 1 ? notes[0] : undefined);
        scoreContext.setCurrentPosition(lyric.position);
    }

    const handleChange = (value: string) => {
        setValue(value);
    }

    const save = () => {
        const l = scoreContext.score.lyrics.find(l => l.position === lyric.position);
        if (l) {
            if (value) {
                l.text = value;
            } else {
                scoreContext.score.lyrics = scoreContext.score.lyrics.filter(l => l.position !== lyric.position);
            }
        } else {
            if (value) {
                scoreContext.score.lyrics.push({
                    text: value,
                    position: lyric.position
                });
            }
        }
        scoreContext.refresh();
        scoreContext.setIsTyping(false);
    }

    return (<>
            {scoreContext.isEditMode &&
                <foreignObject x={x} y={y} width={Layout.stave.note.SPACING} height="40">

                    {/*<Input*/}
                    <Input
                        radius={0}
                        onFocus={() => scoreContext.setIsTyping(true)}
                        onBlur={() => save()}
                        className={`lyric-input`}
                        disabled={!scoreContext.isEditMode}
                        value={value}
                        onChange={e => handleChange(e.target.value)}/>
                </foreignObject>}

            {!scoreContext.isEditMode &&
                <text
                    className="hover-pointer"
                    fill={lyric.position === scoreContext.currentPosition ? Color.stave.HIGHLIGHT : Color.stave.LYRICS}
                    fontWeight={600}
                    x={x}
                    y={y + 20}
                    onClick={handleNoteClick}
                >{lyric.text}</text>}
        </>
    )
};

export default StaveLyric;
