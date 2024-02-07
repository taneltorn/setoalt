import React from "react";
import {useScoreContext} from "../context/ScoreContext.tsx";

const ScoreInfo: React.FC = () => {

    const context = useScoreContext();

    return (
        <code>
            {JSON.stringify(context.score)}
        </code>
    );
}

export default ScoreInfo;
