import React, {useEffect, useState} from "react";
import {Score} from "../../../model/Score.ts";
import ScorePlaybackPanel from "./playback/ScorePlaybackPanel.tsx";
import VoiceFilter from "./playback/controls/VoiceFilter.tsx";
import Stave from "./stave/Stave.tsx";
import {useSearchParams} from "react-router-dom";
import {useScoreContext} from "../../../hooks/useScoreContext.tsx";
import {Layout} from "../../../utils/constants.ts";
import {Group} from "@mantine/core";
import ScoreSettings, {Setting} from "./ScoreSettings.tsx";

interface Properties {
    score?: Score;
    simplified?: boolean;
}

const ScoreEmbedding: React.FC<Properties> = ({score}) => {

    const {dimensions, setIsSimplifiedMode} = useScoreContext();
    const [searchParams] = useSearchParams();

    const [maxWidth, setMaxWidth] = useState<number>();
    const [maxHeight, setMaxHeight] = useState<number>();

    useEffect(() => {
        const simplified = searchParams.get("simplified");
        setIsSimplifiedMode(!!simplified);

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
            maxHeight: maxHeight || dimensions.containerY + 300,
            overflow: "scroll"
        }}>
            <Group justify={"space-between"}>
                <ScorePlaybackPanel/>
                <ScoreSettings settings={[Setting.CHANGE_MODE, Setting.EXPORT_PNG]}/>
            </Group>

            <VoiceFilter/>
            <Stave score={score}/>
        </div>
    );
}

export default ScoreEmbedding;
