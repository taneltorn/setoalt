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

interface Properties {
    score?: Score;
    isEditMode?: boolean;
}

const Stave: React.FC<Properties> = ({score, isEditMode}) => {

    const context = useScoreContext();
    const ref = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        context.setScore(score || EmptyScore);
        context.setContainerRef(ref);
        context.setSvgRef(svgRef);
        context.setIsEditMode(!!isEditMode);
    }, []);

    return (
        <>
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
                    {context.score.data.lyrics.length >= 0 && range(context.endPosition + 1).map((n, i) =>
                        <StaveLyric
                            key={i}
                            lyric={{
                                position: n - 1,
                                text: context.score.data.lyrics.find(l => l.position === (n - 1))?.text || ""
                            }}/>)}
                </svg>
            </div>
        </>
    )
};

export default Stave;
