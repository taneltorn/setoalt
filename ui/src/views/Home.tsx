import React, {useEffect, useState} from "react";
import {Box, Button, Group, Tabs, Text} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";
import Page from "../Page.tsx";
import Header from "../components/controls/Header.tsx";
import Description from "../components/controls/Description.tsx";
import {Trans} from 'react-i18next';
import {Score} from "../model/Score.ts";
import ScoreContextProvider from "../context/ScoreContextProvider.tsx";
import HistoryContextProvider from "../context/HistoryContextProvider.tsx";
import KeyPressHandler from "../components/KeyPressHandler.tsx";
import ScoreDialogs from "./scores/components/dialog/ScoreDialogs.tsx";
import Example from "./Example.tsx";

const Home: React.FC = () => {

    const {t} = useTranslation();
    const [active, setActive] = useState<Score>();
    const [exampleA, setExampleA] = useState<Score>();
    const [exampleB, setExampleB] = useState<Score>();

    useEffect(() => {
        fetch("/examples/a.example.json")
            .then(response => response.json())
            .then(score => {
                setExampleA(score);
                setActive(score);
            });

        fetch("/examples/b.example.json")
            .then(response => response.json())
            .then(score => setExampleB(score));
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

                    <Tabs defaultValue="example1">
                        <Tabs.List>
                            {exampleA &&
                                <Tabs.Tab value="example1" onClick={() => setActive(exampleA)}>
                                    <Text size={"xl"}>
                                        {exampleA?.name}
                                    </Text>
                                </Tabs.Tab>}

                            {exampleB &&
                                <Tabs.Tab value="example2" onClick={() => setActive(exampleB)}>
                                    <Text size={"xl"}>
                                        {exampleB?.name}
                                    </Text>
                                </Tabs.Tab>}
                        </Tabs.List>

                        <Box mt={"lg"}>
                            <Example score={active}/>
                        </Box>
                    </Tabs>

                    <Group gap={4} mt={"md"}>
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
