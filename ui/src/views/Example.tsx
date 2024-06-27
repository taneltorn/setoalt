import React, {useEffect} from "react";
import {Score} from "../model/Score.ts";
import Stave from "./scores/components/stave/Stave.tsx";
import ScorePlaybackPanel from "./scores/components/playback/ScorePlaybackPanel.tsx";
import {useScoreContext} from "../context/ScoreContext.tsx";

interface Properties {
    score?: Score;
}

const Example: React.FC<Properties> = ({score}) => {

    const context = useScoreContext();

    useEffect(() => {
        if (score) {
            context.setScore(score);
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
