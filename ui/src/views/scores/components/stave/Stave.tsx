import React, {useEffect, useRef} from 'react';
import VoiceLine from "./VoiceLine.tsx";
import StaveLyric from "./StaveLyric.tsx";
import CurrentPositionMarker from "./CurrentPositionMarker.tsx";
import StaveDivider from "./StaveDivider.tsx";
import StaveBreak from "./StaveBreak.tsx";
import CursorMarker from "./CursorMarker.tsx";
import StaveBlock from "./StaveBlock.tsx";
import {Score} from "../../../../models/Score.ts";
import {useScoreContext} from "../../../../context/ScoreContext.tsx";
import {EmptyScore, range} from "../../../../utils/helpers.tsx";
import {Layout} from "../../../../utils/constants.ts";
import {Button} from "@mantine/core";
import {useHistoryContext} from "../../../../context/HistoryContext.tsx";

interface Properties {
    score?: Score;
    isEditMode?: boolean;
}

const fixed: Score = {"name":"","data":{"stave":{"name":"PPT","lines":[{"pitch":"b4","y":0,"color":"#eee","strokeWidth":1},{"pitch":"a#4","y":1,"color":"#000","strokeWidth":2},{"pitch":"g4","y":4,"color":"#eee","strokeWidth":1},{"pitch":"f#4","y":5,"color":"#000","strokeWidth":2},{"pitch":"d#4","y":8,"color":"#eee","strokeWidth":1},{"pitch":"d4","y":9,"color":"#000","strokeWidth":2}]},"breaks":[],"dividers":[],"lyrics":[],"voices":[{"name":"torrõ","type":0,"color":"black","notes":[{"pitch":"d4","position":0,"duration":"8n"},{"pitch":"f#4","position":1,"duration":"8n"},{"pitch":"a#4","position":2,"duration":"8n"}]},{"name":"killõ","type":1,"color":"#1aa7ec","notes":[]}]}}
const Stave: React.FC<Properties> = ({score, isEditMode}) => {

    const context = useScoreContext();
    const {history} = useHistoryContext();
    const ref = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        context.setScore(score || structuredClone(EmptyScore));
        context.setContainerRef(ref);
        context.setSvgRef(svgRef);
        context.setIsEditMode(!!isEditMode);
    }, []);

    return (
        <>
            <p>{JSON.stringify(context.activeVoice)}</p>
            <p>{JSON.stringify(history.map(h => h.activeVoice))}</p>
            <Button onClick={() => {
                console.log("click")
                console.log(fixed.data)

                const a = structuredClone(fixed);
                console.log(a.data)

                context.setScore(a)
            }}>CLick</Button>
            <div
                ref={ref}
                style={{
                    marginTop: 15,
                    maxWidth: Layout.stave.container.MAX_WIDTH,
                    overflowX: "scroll",
                    height: context.dimensions.y * context.dimensions.blocks + 30
                }}>

                <svg id={"notation"}
                     ref={svgRef}
                     width={context.dimensions.x}
                     height={context.dimensions.y * context.dimensions.blocks}
                     style={{padding: "0 5px"}}
                >

                    {range(context.score.data.breaks.length + 1)
                        .map((_, index) => (
                            <StaveBlock
                                key={`stave-block-${index}`}
                                index={index}
                                lines={context.score.data.stave.lines}
                            />))}

                    {isEditMode && !context.isExportMode && <CurrentPositionMarker/>}

                    {!context.isExportMode && context.score.data.breaks
                        .map(position =>
                            <StaveBreak
                                key={`break-${position}`}
                                position={position}
                            />)}

                    {context.score.data.voices
                        .sort((a, b) => (a.type || 0) - (b.type || 0))
                        .filter(v => isEditMode || !v.hidden)
                        .map(voice =>
                            <VoiceLine
                                key={voice.name}
                                voice={voice}
                            />)}

                    {!context.isExportMode && <CursorMarker/>}

                    {context.score.data.dividers
                        .map(divider =>
                            <StaveDivider
                                key={`divider-${divider.position}`}
                                divider={divider}
                            />)}

                    {context.score.data.lyrics.length >= 0 &&
                        range(0, context.endPosition - 1)
                            .map((n, i) =>
                                <StaveLyric
                                    key={i}
                                    lyric={{
                                        position: n,
                                        text: context.score.data.lyrics.find(l => l.position === n)?.text || ""
                                    }}/>)}
                </svg>
            </div>
        </>
    )
};

export default Stave;
