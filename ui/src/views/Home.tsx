import {Button, Group, Text, Title} from "@mantine/core";
import {useTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import TextLink from "../components/common/TextLink.tsx";
import {Link} from "react-router-dom";
import Markdown from "react-markdown";
import Page from "../Page.tsx";

const Home: React.FC = () => {

    const {t} = useTranslation();

    const [changelog, setChangelog] = useState<string>("");


    useEffect(() => {
        fetch("/CHANGELOG.md")
            .then(response => response.text())
            .then(text => {
                setChangelog(text);
            });
    }, []);

    return (
        <Page title={t("view.home.pageTitle")}>
            <Title order={1} mb={"xs"}>{t("view.home.title")}</Title>
            <Text>{t("view.home.description")}</Text>

            <Text mt={"lg"} fw={600}>Tähtis teadaanne!</Text>
            <Text>
                Kuna tegu arendusjärgus oleva tarkvaraga, võid siin-seal kohata (loe: kindlasti kohtad) erinevaid vigu
                ja puudujääke. See on iteratiivses tarkvaraarendusprotsessis
                täiesti normaalne. Rakendus valmib järk-järgult, hõlmates mitmeid tagasisideringe.

            </Text>
            <Text mt={"sm"}>Kui leiad vea või sul on muid ettepanekuid, võid need märkida
                <TextLink
                    prefix={" "}
                    target={"_blank"}
                    to={"https://docs.google.com/spreadsheets/d/12FNdYhMyWxYqobvzv78f-G60YGdq1Q2Gqb8zZ58UeTw"}
                    label={"siia tabelisse"}
                />.
            </Text>

            <Group gap={4} mt={"md"} mb={"xl"}>
                <Link to={"/scores/1"}>
                    <Button>Kuula näidet</Button>
                </Link>
                <Link to={"/editor"}>
                    <Button>Katseta</Button>
                </Link>
            </Group>


            <div>
                <Markdown>{changelog}</Markdown>
            </div>
        </Page>
    );
}

export default Home;
