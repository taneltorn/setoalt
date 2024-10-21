import React, {useEffect} from "react";
import {Score} from "../../../model/Score.ts";
import VoiceFilter from "../details/components/playback/VoiceFilter.tsx";
import Stave from "../details/components/stave/Stave.tsx";
import {useSearchParams} from "react-router-dom";
import {useScoreContext} from "../../../hooks/useScoreContext.tsx";
import {Group} from "@mantine/core";
import ScoreSettings, {Setting} from "../details/components/ScoreSettings.tsx";
import ScoreEditorPanel from "../editor/components/ScoreEditorPanel.tsx";
import VoiceControls from "../editor/components/controls/VoiceControls.tsx";
import Page from "../../../Page.tsx";
import PlaybackControls from "../details/components/playback/PlaybackControls.tsx";

interface Properties {
    score?: Score;
    simplified?: boolean;
    isEditMode?: boolean;
}

const ScoreEmbedding: React.FC<Properties> = ({score, isEditMode}) => {

    const {setIsSimplifiedMode, setActivePosition} = useScoreContext();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const simplified = searchParams.get("simplified");
        setIsSimplifiedMode(!!simplified);

        const position = searchParams.get("position");
        if (position && !isNaN(parseInt(position))) {
            setActivePosition(+position)
        }
    }, []);

    return (
        <Page title={score?.name}>
            <Group justify={"space-between"}>
                <PlaybackControls/>
                <ScoreSettings settings={[Setting.CHANGE_MODE, Setting.EXPORT_PNG]}/>
            </Group>

            {isEditMode
                ? <>
                    <VoiceControls/>
                    <ScoreEditorPanel/>
                    <Stave isEditMode/>
                </>
                : <>
                    <VoiceFilter/>
                    <Stave score={score}/>
                </>
            }
        </Page>
    );
}

export default ScoreEmbedding;
