import React, {useEffect, useRef} from 'react';
import {Layout} from "../../utils/constants";
import VoiceLine from "./VoiceLine";
import {Score} from "../../models/Score";
import {useScoreContext} from "../../context/ScoreContext";
import {range} from "../../utils/helpers.tsx";
import StaveBlock from "./StaveBlock";
import StaveLyric from "./StaveLyric";
import Break from "./Break";
import Cursor from "./Cursor";
import Divider from "./Divider";

interface Properties {
    score: Score;
    showCursor?: boolean;
}

const Stave: React.FC<Properties> = (props) => {

    const context = useScoreContext();

    const ref = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        context.setScore(props.score);
    }, []);

    return (
        <div
            ref={ref}
            style={{
                maxWidth: Layout.stave.container.MAX_WIDTH,
                overflowX: "scroll",
                height: context.dimensions.y * (context.score.data.breaks.length + 1) + 30
            }}>
            <svg width={context.dimensions.x}
                 height={context.dimensions.y * (context.score.data.breaks.length + 1)}>

                {props.showCursor && <Cursor/>}

                {range(context.score.data.breaks.length + 1)
                    .map((_, index) => (
                        <StaveBlock
                            key={`stave-${index}`}
                            lines={context.score.data.stave.lines}
                            y={index * context.dimensions.y}
                        />
                    ))}

                {context.score.data.lyrics.length >= 0 && range(context.endPosition + 1).map((n, i) =>
                    <StaveLyric
                        key={i}
                        lyric={{
                            position: n - 1,
                            text: context.score.data.lyrics.find(l => l.position === (n - 1))?.text || ""
                        }}/>
                )}

                {context.score.data.breaks.map(n => <Break key={`break-${n}`} position={n}/>)}
                {context.score.data.dividers.map(n => <Divider key={`divider-${n}`} position={n}/>)}

                {context.score.data.voices.map(voice =>
                    <VoiceLine
                        key={voice.name}
                        voice={voice}
                    />)}
            </svg>
        </div>
    )
};

export default Stave;
