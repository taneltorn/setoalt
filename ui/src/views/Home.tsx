import React, {useEffect, useState} from "react";
import {Box, Button, Group} from "@mantine/core";
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
    const [exampleScore, setExampleScore] = useState<Score>();

    useEffect(() => {
        fetch(`${import.meta.env.VITE_PUBLIC_URL}/examples/a.example.json`)
            .then(response => response.json())
            .then(score => {
                setExampleScore(score);
            });
    }, []);

    return (
        <ContextProviders>
            <Page title={t("view.home.title")}>

                <Header>
                    {t("view.home.header")}
                </Header>

                <Description span={12}>
                    <Trans i18nKey="view.home.description"
                           components={[<strong></strong>,
                               <Link target="_blank" to="https://laul.setomaa.ee/leelokool"/>]}/>
                </Description>

                {exampleScore &&
                    <Box mt={"lg"}>
                        <Example score={exampleScore}/>
                    </Box>}

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