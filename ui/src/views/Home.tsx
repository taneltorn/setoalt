import React, {useEffect, useState} from "react";
import {Button, Group, Text, Title} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";
import Page from "../Page.tsx";
import Header from "../components/controls/Header.tsx";
import Description from "../components/controls/Description.tsx";
import {Trans} from 'react-i18next';
import {Score} from "../model/Score.ts";
import Stave from "./scores/components/stave/Stave.tsx";
import ScoreContextProvider from "../context/ScoreContextProvider.tsx";
import HistoryContextProvider from "../context/HistoryContextProvider.tsx";
import KeyPressHandler from "../components/KeyPressHandler.tsx";
import ScoreDialogs from "./scores/components/dialog/ScoreDialogs.tsx";
import ScorePlaybackPanel from "./scores/components/playback/ScorePlaybackPanel.tsx";

const Home: React.FC = () => {

    const {t} = useTranslation();
    const [example, setExample] = useState<Score>();

    useEffect(() => {
        fetch("/examples/Score.example.json")
            .then(response => response.json())
            .then(score => {
                setExample(score);
            });
    }, []);

    return (
        <HistoryContextProvider>
            <ScoreContextProvider>
                <Page title={t("view.home.pageTitle")}>
                    <Header>
                        {t("view.home.title")}
                    </Header>

                    <Description span={12}>
                        <Trans i18nKey="view.home.description"/>
                    </Description>

                    {example && <>
                        <Text size={"xl"}>
                            Näide
                        </Text>
                        <Title order={3}  mb={"md"}>{example.name}</Title>


                        <ScorePlaybackPanel/>
                        <Stave score={example}/>
                    </>}

                    <Group gap={4}>
                        <Link to={"/editor"}>
                            <Button size={"md"} color={"red"}>
                                {t("view.home.link.editor")}
                            </Button>
                        </Link>
                        <Link to={"/scores"}>
                            <Button size={"md"} color={"red"}>
                                {t("view.home.link.scores")}
                            </Button>
                        </Link>
                    </Group>
                </Page>

                <KeyPressHandler/>
                <ScoreDialogs/>
            </ScoreContextProvider>
        </HistoryContextProvider>
    );
}

export default Home;
