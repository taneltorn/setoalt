import React, {useEffect} from "react";
import {Score} from "../model/Score.ts";
import Stave from "./scores/components/stave/Stave.tsx";
import ScorePlaybackPanel from "./scores/components/playback/ScorePlaybackPanel.tsx";
import {useScoreContext} from "../hooks/useScoreContext.tsx";
import {useAudioContext} from "../hooks/useAudioContext.tsx";

interface Properties {
    score?: Score;
}

const Example: React.FC<Properties> = ({score}) => {

    const context = useScoreContext();
    const {stopPlayback} = useAudioContext();

    useEffect(() => {
        if (score) {
            stopPlayback();

            context.setScore(score);
            context.setActivePosition(-1);
        }
    }, [score]);
    return (
        <>
            {score &&
                <>
                    <ScorePlaybackPanel/>
                    <Stave score={score}/>
                </>}
        </>
    );
}

export default Example;
