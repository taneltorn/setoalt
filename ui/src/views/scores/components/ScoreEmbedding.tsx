import React, {useEffect, useState} from "react";
import {Score} from "../../../model/Score.ts";
import ScorePlaybackPanel from "./playback/ScorePlaybackPanel.tsx";
import VoiceFilter from "./playback/controls/VoiceFilter.tsx";
import Stave from "./stave/Stave.tsx";
import {useSearchParams} from "react-router-dom";
import {useScoreContext} from "../../../context/ScoreContext.tsx";
import {Layout} from "../../../utils/constants.ts";

interface Properties {
    score?: Score;
}

const ScoreEmbedding: React.FC<Properties> = ({score}) => {

    const {dimensions} = useScoreContext();
    const [searchParams] = useSearchParams();

    const [maxWidth, setMaxWidth] = useState<number>();
    const [maxHeight, setMaxHeight] = useState<number>();

    useEffect(() => {
        const width = searchParams.get("width");
        if (width) {
            setMaxWidth(+width)
        }

        const height = searchParams.get("height");
        if (height) {
            setMaxHeight(+height)
        }
    }, []);
    return (
            <div style={{
                maxWidth: maxWidth || Layout.stave.container.MAX_WIDTH,
                maxHeight: maxHeight || dimensions.containerY + 1300,
                overflow: "scroll"
            }}>
                <ScorePlaybackPanel/>

                <VoiceFilter/>
                <Stave score={score}/>
            </div>
    );
}

export default ScoreEmbedding;
