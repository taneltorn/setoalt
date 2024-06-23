import React, {useMemo, useState} from 'react';
import {Lyric} from "../../../../model/Lyric.ts";
import {useAudioContext} from "../../../../context/AudioContext.tsx";
import {useScoreContext} from "../../../../context/ScoreContext.tsx";
import {calculateLyricCoords} from "../../../../utils/calculation.helpers.tsx";
import {Color, Layout} from "../../../../utils/constants.ts";

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


    const handleClick = () => {
        audioContext.stopPlayback();
        scoreContext.activate(lyric.position)
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
        scoreContext.setIsTypeMode(false);
    }

    return (<>
            {scoreContext.isEditMode && !scoreContext.isExportMode &&
                <foreignObject key={`lyric-${lyric.position}`} x={x - 20} y={y} width={Layout.stave.note.SPACING} height="40">
                    <input
                        onFocus={() => scoreContext.setIsTypeMode(true)}
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
                    fill={lyric.position === scoreContext.activePosition && !scoreContext.isExportMode ? Color.stave.HIGHLIGHT : Color.stave.LYRICS}
                    fontWeight={Layout.stave.lyrics.FONT_WEIGHT}
                    fontSize={Layout.stave.lyrics.FONT_SIZE}
                    x={x}
                    y={y}
                    onClick={handleClick}
                >{lyric.text}</text>}
        </>
    )
};

export default StaveLyric;
