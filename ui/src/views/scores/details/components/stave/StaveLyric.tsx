import React, {useEffect, useMemo, useState} from 'react';
import {Lyric} from "../../../../../model/Lyric.ts";
import {useAudioContext} from "../../../../../hooks/useAudioContext.tsx";
import {useScoreContext} from "../../../../../hooks/useScoreContext.tsx";
import {calculateLyricCoords} from "../../../../../utils/calculation.helpers.tsx";
import {useHistory} from "../../../../../hooks/useHistory.tsx";
import {useMantineTheme} from "@mantine/core";
import {useLayoutParams} from "../../../../../hooks/useLayoutParams.tsx";

interface Properties {
    lyric: Lyric;
}

const StaveLyric: React.FC<Properties> = ({lyric}) => {

    const theme = useMantineTheme();
    const context = useScoreContext();
    const history = useHistory();
    const {stopPlayback} = useAudioContext();
    const {params} = useLayoutParams();

    const [value, setValue] = useState<string>(lyric.text);
    const breaksDependency = JSON.stringify(context.score.data.breaks);

    const {x, y} = useMemo(() => {
        return calculateLyricCoords(lyric, context, params);
    }, [lyric.position, context.score.data.stave, breaksDependency, params]);


    const handleClick = () => {
        stopPlayback();
        context.activate(lyric.position)
    }

    const handleChange = (value: string) => {
        setValue(value);
    }

    const handleFocus = () => {
        context.setIsTypeMode(true);
        context.activate(lyric.position);
    }

    const save = () => {
        history.snapshot(context);

        const l = context.score.data.lyrics.find(l => l.position === lyric.position);
        if (l) {
            if (value) {
                l.text = value;
            } else {
                context.score.data.lyrics = context.score.data.lyrics.filter(l => l.position !== lyric.position);
            }
        } else {
            if (value) {
                context.score.data.lyrics.push({
                    text: value,
                    position: lyric.position
                });
            }
        }
        context.refresh();
        context.setIsTypeMode(false);
    }

    useEffect(() => {
        setValue(lyric.text)
    }, [lyric.text]);

    return (<>
            {context.isEditMode && !context.isExportMode &&
                <foreignObject key={`lyric-${lyric.position}`} x={x - 20} y={y} width={params.NOTE_SPACING}
                               height={params.LYRICS_HEIGHT}>
                    <input
                        onFocus={handleFocus}
                        onBlur={() => save()}
                        className={`lyric-input`}
                        disabled={!context.isEditMode}
                        value={value}
                        style={{
                            width: params.NOTE_SPACING,
                            borderRadius: 12,
                            color: lyric.position === context.activePosition && !context.isExportMode
                                ? theme.colors.red[9]
                                : "black",
                            fontWeight: params.LYRICS_FONT_WEIGHT,
                            fontSize: params.LYRICS_FONT_SIZE,
                            height: params.LYRICS_HEIGHT
                        }}
                        onChange={e => handleChange(e.target.value)}
                    />

                </foreignObject>}

            {(!context.isEditMode || context.isExportMode) &&
                <text
                    className="hover-pointer"
                    fill={lyric.position === context.activePosition && !context.isExportMode
                        ? theme.colors.red[9]
                        : "black"}
                    fontWeight={params.LYRICS_FONT_WEIGHT}
                    fontSize={lyric.text.length >= params.LYRICS_DECREASE_FONT_FROM ? params.LYRICS_DECREASED_FONT_SIZE : params.LYRICS_FONT_SIZE}
                    x={x}
                    y={y}
                    onClick={handleClick}
                >{lyric.text}</text>}
        </>
    )
};

export default StaveLyric;
