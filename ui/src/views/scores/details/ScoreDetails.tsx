import React from "react";
import Page from "../../../Page.tsx";
import {Group} from "@mantine/core";
import {Score} from "../../../model/Score.ts";
import Description from "../../../components/controls/Description.tsx";
import VoiceFilter from "./components/playback/VoiceFilter.tsx";
import Stave from "./components/stave/Stave.tsx";
import ScoreSettings from "./components/ScoreSettings.tsx";
import {AllScoreSettings} from "../../../utils/dictionaries.ts";
import PlaybackControls from "./components/playback/PlaybackControls.tsx";
import ScoreLyrics from "./components/ScoreLyrics.tsx";
import ScoreRecording from "./components/ScoreRecording.tsx";
import ScoreHeader from "./components/ScoreHeader.tsx";

interface Properties {
    score: Score;
}

const ScoreDetails: React.FC<Properties> = ({score}) => {

    return (
        <Page title={score.name}>
            <ScoreHeader score={score}/>

            {score.recording && <ScoreRecording recording={score.recording}/>}

            <Description>{score.description}</Description>

            <Group justify={"space-between"}>
                <PlaybackControls/>
                <ScoreSettings settings={AllScoreSettings}/>
            </Group>

            <VoiceFilter/>
            <Stave score={score}/>

            <ScoreLyrics lyrics={score?.text}/>
        </Page>
    );
}

export default ScoreDetails;
