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
import StaveDivider from "./StaveDivider.tsx";
import {DividerType} from "../../models/Divider.ts";
import NotePreviewBar from "./NotePreviewBar.tsx";
import useMousePosition from "../../hooks/useMousePosition.tsx";
import StaveBreak from "./StaveBreak.tsx";

interface Properties {
    score: Score;
    showCursor?: boolean;


}

const Stave: React.FC<Properties> = ({score}) => {

    const context = useScoreContext();

    const ref = useRef<HTMLDivElement>(null)



    useEffect(() => {
        context.setScore(score);
        context.setContainerRef(ref);


    }, []);

    return (
        <div
            ref={ref}
            style={{
                maxWidth: Layout.stave.container.WIDTH,
                overflowX: "scroll",
                height: context.dimensions.y * context.dimensions.blocks + 30
            }}>
            <svg width={context.dimensions.x} height={context.dimensions.y * context.dimensions.blocks}>

                {/*{props.showCursor && <Cursor/>}*/}
                <Cursor/>

                {range(context.score.data.breaks.length + 1)
                    .map((_, index) => (
                        // todo rename to lineblock or something
                        <StaveBlock
                            key={`stave-block-${index}`}
                            index={index}
                            lines={context.score.data.stave.lines}
                        />
                    ))}

                {context.score.data.breaks
                    .map(position =>
                        <StaveBreak
                            key={`break-${position}`}
                            position={position}
                        />)}

                {context.score.data.lyrics.length >= 0 && range(context.endPosition + 1).map((n, i) =>
                    <StaveLyric
                        key={i}
                        lyric={{
                            position: n - 1,
                            text: context.score.data.lyrics.find(l => l.position === (n - 1))?.text || ""
                        }}/>
                )}


                {context.score.data.dividers
                    .map(divider => <StaveDivider
                        key={`divider-${divider.position}`}
                        divider={divider}
                    />)}


                {context.score.data.voices.map(voice =>
                    <VoiceLine
                        key={voice.name}
                        voice={voice}
                    />)}

                {/*{props.showCursor && <NotePreviewBar/>}*/}
            </svg>
        </div>
    )
};

export default Stave;
