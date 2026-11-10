import React, {useState} from "react";
import Page from "../../../Page.tsx";
import {Button, Group, ScrollArea,} from "@mantine/core";
import {Score} from "../../../model/Score.ts";
import Description from "../../../components/controls/Description.tsx";
import VoiceFilter from "./components/playback/VoiceFilter.tsx";
import Stave from "./components/stave/Stave.tsx";
import ScoreSettings from "./components/ScoreSettings.tsx";
import {AllScoreSettings} from "../../../utils/dictionaries.ts";
import PlaybackControls from "./components/playback/PlaybackControls.tsx";
import ScoreRecording from "./components/ScoreRecording.tsx";
import ScoreHeader from "./components/ScoreHeader.tsx";
import ScoreLyricsSection from "./ScoreLyricsSection.tsx";
import {useTranslation} from "react-i18next";
import {useElementSize} from "@mantine/hooks";
import {useLayoutParams} from "../../../hooks/useLayoutParams.tsx";

interface Properties {
    score: Score;
}

const ScoreDetails: React.FC<Properties> = ({score}) => {

    const {t} = useTranslation();
    const {ref: lyricsRef, height: lyricsHeight} = useElementSize();
    const {params} = useLayoutParams();

    const [showAllLyrics, setShowAllLyrics] = useState(false);

    const exceedsMaxHeight = lyricsHeight > params.LYRICS_TEXT_HEIGHT;

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


            {score.text && (<>
                    <ScrollArea h={exceedsMaxHeight && !showAllLyrics ? params.LYRICS_TEXT_HEIGHT : undefined}>
                        <div ref={lyricsRef}>
                            <ScoreLyricsSection score={score}/>
                        </div>
                    </ScrollArea>

                    {exceedsMaxHeight && !showAllLyrics && (
                        <Button
                            mt={"md"}
                            variant={"subtle"}
                            onClick={() => setShowAllLyrics(true)}
                        >
                            {t("button.displayAll")}
                        </Button>
                    )}
                </>
            )}


            {/*<p>{JSON.stringify(score)}</p>*/}
        </Page>
    );
}

export default ScoreDetails;
