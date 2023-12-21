import React, {useEffect, useState} from "react";
import {Grid, Group, Loader, Text, Title} from "@mantine/core";
import {Score} from "../models/Score.ts";
import Stave from "../components/stave/Stave.tsx";
import PlaybackPanel from "../components/controls/PlaybackPanel.tsx";
import ScoreContextProvider from "../context/ScoreContextProvider.tsx";
import {useParams} from "react-router";
import useScoreService from "../services/ScoreService.tsx";
import StaveSkeleton from "../components/stave/StaveSkeleton.tsx";
import TransposeDialog from "../components/dialog/TransposeDialog.tsx";
import {Link} from "react-router-dom";
import {IoChevronBack} from "react-icons/io5";
import KeyPressHandler from "../components/KeyPressHandler.tsx";

const ScoreDetails: React.FC = () => {

    const scoreService = useScoreService();
    const [score, setScore] = useState<Score>();
    const params = useParams();

    useEffect(() => {
        if (!params.id) {
            return;
        }

        scoreService.fetchScore(params.id, setScore);
    }, []);

    return (
        <ScoreContextProvider>
            <KeyPressHandler/>

            {scoreService.isLoading && <>
                <Loader/>
                <StaveSkeleton/>
            </>}

            {score && <>
                <Group gap={4} align={"center"} mb={"xs"}>
                    <Link to={"/scores"} style={{display: "flex"}}>
                        <IoChevronBack size={30}/>
                    </Link>
                    <Title order={1}>{score.title}</Title>
                </Group>

                <Grid mb={"md"}>
                    <Grid.Col span={8}>
                        {score.description && <Text>{score.description}</Text>}
                    </Grid.Col>
                </Grid>

                <PlaybackPanel/>
                <Stave score={score}/>

                <Grid>
                    <Grid.Col span={8}>
                        <Text>
                            <pre>
                            {score.text}
                            </pre>
                        </Text>
                    </Grid.Col>
                </Grid>

                <TransposeDialog/>
            </>}

        </ScoreContextProvider>
    );
}

export default ScoreDetails;
