import React, {} from "react";
import {Text} from "@mantine/core";
import {useTranslation} from "react-i18next";
import Page from "../Page.tsx";
import Header from "../components/controls/Header.tsx";
import Description from "../components/controls/Description.tsx";
import {Trans} from 'react-i18next';
import ContextProviders from "../ContextProviders.tsx";

const MEMBERS = [
    "Janika Oras",
    "Mari Palolill",
    "Žanna Pärtlas",
    "Hans-Gunther Lock",
    "Tanel Torn",
];

const FUNDED_BY = "Kultuuriministeerium, 4.1-3/23/46";
const COPYRIGHT = "© Tanel Torn, Eesti Kirjandusmuuseum";

const About: React.FC = () => {

    const {t} = useTranslation();

    return (
        <ContextProviders>
            <Page title={t("view.about.title")}>

                <Header>
                    {t("view.about.header")}
                </Header>
                <Description span={12}>
                    <Trans i18nKey="view.about.description"
                           components={[<strong></strong>]}/>
                    
                    <Text mt={"xs"}>{t("view.about.fundedBy", {fundedBy: FUNDED_BY})}</Text>
                    
                    <Text mt={"xs"}>
                        {t("view.about.members", {members: MEMBERS.join(", ")})}
                    </Text>

                    <Text mt={"xs"}>{t("view.about.contact", {email: "janika.oras@folklore.ee, tanel.torn@folklore.ee"})}</Text>
                    <Text mt={"xs"}>{COPYRIGHT}</Text>
                    
                </Description>
            </Page>
        </ContextProviders>
    );
}

export default About;
