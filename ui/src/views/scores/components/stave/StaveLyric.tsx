import React, {useEffect, useMemo, useState} from 'react';
import {Lyric} from "../../../../model/Lyric.ts";
import {useAudioContext} from "../../../../hooks/useAudioContext.tsx";
import {useScoreContext} from "../../../../hooks/useScoreContext.tsx";
import {calculateLyricCoords} from "../../../../utils/calculation.helpers.tsx";
import {Layout} from "../../../../utils/constants.ts";
import {useHistory} from "../../../../hooks/useHistory.tsx";
import {useMantineTheme} from "@mantine/core";

interface Properties {
    lyric: Lyric;
}

const StaveLyric: React.FC<Properties> = ({lyric}) => {

    const theme = useMantineTheme();
    const context = useScoreContext();
    const history = useHistory();
    const {stopPlayback} = useAudioContext();

    const [value, setValue] = useState<string>(lyric.text);
    const breaksDependency = JSON.stringify(context.score.data.breaks);

    const {x, y} = useMemo(() => {
        return calculateLyricCoords(lyric, context);
    }, [lyric.position, context.score.data.stave, breaksDependency]);


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
                <foreignObject key={`lyric-${lyric.position}`} x={x - 20} y={y} width={Layout.stave.note.SPACING}
                               height="40">
                    <input
                        onFocus={handleFocus}
                        onBlur={() => save()}
                        className={`lyric-input`}
                        disabled={!context.isEditMode}
                        value={value}
                        style={{
                            width: Layout.stave.note.SPACING,
                            borderRadius: 12,
                            color: lyric.position === context.activePosition && !context.isExportMode
                                ? theme.colors.red[9]
                                : "black",
                            fontWeight: Layout.stave.lyrics.FONT_WEIGHT,
                            fontSize: Layout.stave.lyrics.FONT_SIZE
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
                    fontWeight={Layout.stave.lyrics.FONT_WEIGHT}
                    fontSize={lyric.text.length > 5 ? Layout.stave.lyrics.DECREASED_FONT_SIZE : Layout.stave.lyrics.FONT_SIZE}
                    x={x}
                    y={y}
                    onClick={handleClick}
                >{lyric.text}</text>}
        </>
    )
};

export default StaveLyric;
