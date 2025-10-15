import React, {useEffect, useState} from "react";
import {Button, Divider, Grid, Group, Text} from "@mantine/core";
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
import {Contact} from "../utils/constants.ts";
import Sponsors from "../components/Sponsors.tsx";

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
                
                {exampleScore && <Example score={exampleScore}/>}

                <Group gap={4} mb={"xl"}>
                    <Link to={"/editor"}>
                        <Button size={"sm"} color={"red"}>
                            {t("view.home.link.editor")}
                        </Button>
                    </Link>
                    <Link to={"/scores"}>
                        <Button size={"sm"} color={"red"}>
                            {t("view.home.link.scores")}
                        </Button>
                    </Link>
                </Group>


                <Divider my={"xl"}/>

                <Grid>
                    <Grid.Col span={{xl: 3, lg: 3, xs: 12}}>
                        <Text fw={"bold"}>{t("view.home.creators")}</Text>
                        <Text><Trans i18nKey={"view.home.creatorList"}/></Text>
                    </Grid.Col>
                    <Grid.Col span={{xl: 5, lg: 4, sm: 12}}>
                        <Text fw={"bold"}>{t("view.home.sponsors")}</Text>
                        <Text>
                            <Trans i18nKey="view.home.sponsorList"/>
                        </Text>
                    </Grid.Col>
                    <Grid.Col span={{xl: 2, lg: 3, xs: 12}}>
                        <Text fw={"bold"}>{t("view.home.contact")}</Text>
                        <Text>{Contact}</Text>
                    </Grid.Col>
                </Grid>
                <Text mt={"xl"}>{t("view.home.copyright")}</Text>

                <Text mt={"sm"} fs={"italic"}>
                    {t("view.home.description2")}
                </Text>
                <Sponsors/>
            </Page>

            <KeyPressHandler/>
            <ScoreDialogs/>
        </ContextProviders>
    );
}

export default Home;