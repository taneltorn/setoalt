import React, {useEffect, useState} from "react";
import {Button, Grid, Group, Loader, Text, Title} from "@mantine/core";
import {Score} from "../models/Score.ts";
import Stave from "../components/stave/Stave.tsx";
import PlaybackPanel from "../components/controls/PlaybackPanel.tsx";
import ScoreContextProvider from "../context/ScoreContextProvider.tsx";
import {useParams} from "react-router";
import useScoreService from "../services/ScoreService.tsx";
import StaveSkeleton from "../components/stave/StaveSkeleton.tsx";
import TransposeDialog from "../components/dialog/TransposeDialog.tsx";
import {Link, useNavigate} from "react-router-dom";
import {IoChevronBack} from "react-icons/io5";
import KeyPressHandler from "../components/KeyPressHandler.tsx";
import {notifications} from "@mantine/notifications";
import {IoMdAlert} from "react-icons/io";
import {useAuth} from "../context/AuthContext.tsx";
import EditScoreForm from "../components/form/EditScoreForm.tsx";
import {useTranslation} from "react-i18next";
import ScoreInfo from "../components/ScoreInfo.tsx";
import {useDevMode} from "../context/DevModeContext.tsx";

interface Properties {
    isEditMode?: boolean;
}

const ScoreDetails: React.FC<Properties> = ({isEditMode}) => {

    const {t} = useTranslation();
    const scoreService = useScoreService();
    const [score, setScore] = useState<Score>();
    const params = useParams();
    const navigate = useNavigate();
    const auth = useAuth();
    const {isDevMode} = useDevMode();

    useEffect(() => {
        if (!params.id) {
            return;
        }

        scoreService.fetchScore(params.id)
            .then(r => {
                setScore(r)
            })
            .catch(_ => notifications.show({
                title: "Viga!",
                message: "Lugu ei leitud.",
                icon: <IoMdAlert color={"red"} size={40}/>,
                color: "white"
            }));
    }, []);

    return (
        <ScoreContextProvider>
            <KeyPressHandler/>

            {scoreService.isLoading && <>
                <Loader/>
                <StaveSkeleton/>
            </>}

            {score && !scoreService.isLoading && <>

                <Group justify={"space-between"}>

                    <Group gap={4} align={"center"} mb={"xs"}>
                        <Link to={"/scores"} style={{display: "flex"}}>
                            <IoChevronBack size={30}/>
                        </Link>
                        <Title order={1}>{score.name}</Title>
                    </Group>

                    {auth.currentUser && !isEditMode && <Link to={"edit"}>
                        <Button size={"md"}>
                            {t("button.edit")}
                        </Button>
                    </Link>}

                </Group>

                {!isEditMode &&
                    <Grid mb={"md"}>
                        <Grid.Col span={8}>
                            {score.description && <Text>{score.description}</Text>}
                        </Grid.Col>
                    </Grid>}


                <PlaybackPanel/>
                <Stave score={score} isEditMode={isEditMode}/>

                <EditScoreForm
                    values={score}
                    onSubmit={() => navigate(`/scores/${score.id}`)}
                />

                {!isEditMode && <Grid>
                    <Grid.Col span={8}>
                        <Text>
                            <pre>
                            {score.text}
                            </pre>
                        </Text>
                    </Grid.Col>
                </Grid>}

                {isDevMode && <ScoreInfo/>}

                <TransposeDialog/>
            </>}

        </ScoreContextProvider>
    );
}

export default ScoreDetails;
