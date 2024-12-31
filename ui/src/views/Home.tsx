import React, {useEffect, useState} from "react";
import {Box, Button, Group, Tabs, Text} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";
import Page from "../Page.tsx";
import Header from "../components/controls/Header.tsx";
import Description from "../components/controls/Description.tsx";
import {Trans} from 'react-i18next';
import {Score} from "../model/Score.ts";
import KeyPressHandler from "../components/KeyPressHandler.tsx";
import ScoreDialogs from "./scores/details/components/ScoreDialogs.tsx";
import Example from "./Example.tsx";
import ContextProviders from "../ContextProviders.tsx";

const Home: React.FC = () => {

    const {t} = useTranslation();
    const [active, setActive] = useState<Score>();
    const [exampleA, setExampleA] = useState<Score>();

    useEffect(() => {
        fetch(`${import.meta.env.VITE_PUBLIC_URL}/examples/a.example.json`)
            .then(response => response.json())
            .then(score => {
                setExampleA(score);
                setActive(score);
            });
    }, []);

    return (
        <ContextProviders>
            <Page title={t("view.home.title")}>

                <Header>
                    {t("view.home.header")}
                </Header>

                <Description span={12}>
                    <Trans i18nKey="view.home.description"/>
                </Description>

                <Tabs defaultValue="example1" radius={"xs"}>
                    <Tabs.List>
                        {exampleA &&
                            <Tabs.Tab value="example1" onClick={() => setActive(exampleA)}>
                                {t("page.example")}:
                                <Text size={"lg"} fw={"bold"}>
                                    {exampleA?.name}
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
        </ContextProviders>
    );
}

export default Home;
