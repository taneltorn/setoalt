import React from "react";
import Page from "../../../../Page.tsx";
import ScoreDetailsHeader from "./ScoreDetailsHeader.tsx";
import {Grid, Group, Text} from "@mantine/core";
import ScorePlaybackPanel from "../common/playback/ScorePlaybackPanel.tsx";
import Stave from "../common/stave/Stave.tsx";
import ScoreDetailsControls from "./ScoreDetailsControls.tsx";
import {Score} from "../../../../models/Score.ts";
import VoiceFilter from "../common/playback/controls/VoiceFilter.tsx";

interface Properties {
    score: Score;
}

const ScoreDetails: React.FC<Properties> = ({score}) => {

    return (
        <Page title={score?.name}>
            <Group justify={"space-between"} mb={"lg"}>
                <ScoreDetailsHeader/>
                <ScoreDetailsControls/>
            </Group>

            <Grid mb={"lg"}>
                <Grid.Col span={8}>
                    <Text>{score.description}</Text>
                </Grid.Col>
            </Grid>

            <ScorePlaybackPanel/>

            <VoiceFilter/>
            <Stave score={score}/>

            <Grid>
                <Grid.Col span={8}>
                    <Text fz={18}>
                        <pre>
                            {score?.text}
                        </pre>
                    </Text>
                </Grid.Col>
            </Grid>
        </Page>
    );
}

export default ScoreDetails;
