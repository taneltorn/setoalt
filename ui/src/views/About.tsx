import React, {} from "react";
import {Group, Text} from "@mantine/core";
import {useTranslation} from "react-i18next";
import Page from "../Page.tsx";
import Header from "../components/controls/Header.tsx";
import {Trans} from 'react-i18next';
import ContextProviders from "../ContextProviders.tsx";
import Description from "../components/controls/Description.tsx";
import Sponsors from "../components/Sponsors.tsx";

const Creators = [
    "Janika Oras",
    "Mari Palolill",
    "Žanna Pärtlas",
    "Hans-Gunther Lock",
    "Tanel Torn",
];

const labelColWidth = 150;

const Contact = "janika.oras@folklore.ee, tanel.torn@folklore.ee";

const About: React.FC = () => {

    const {t} = useTranslation();

    return (
        <ContextProviders>
            <Page title={t("view.about.title")}>

                <Header>
                    {t("view.about.header")}
                </Header>

                <Description span={12}>
                    <Trans i18nKey="view.about.description"/>
                </Description>

                <Group align={"flex-start"} mt={"md"}>
                    <Text w={labelColWidth}>{t("view.about.creators")}</Text>
                    <Text>{Creators.map((m, i) => <><span key={i}>{m}</span><br/></>)}</Text>
                </Group>

                <Group align={"flex-start"} mt={"md"}>
                    <Text w={labelColWidth}>{t("view.about.sponsors")}</Text>
                    <Text>
                        <Trans i18nKey="view.about.sponsorList"/>
                    </Text>
                </Group>

                <Group align={"flex-start"} mt={"md"}>
                    <Text w={labelColWidth}>{t("view.about.contact")}</Text>
                    <Text>{Contact}</Text>
                </Group>

                <Text mt={"xl"}>{t("view.about.copyright")}</Text>

                <Sponsors/>
            </Page>
        </ContextProviders>
    );
}

export default About;
