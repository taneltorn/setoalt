import React, {useEffect, useState} from "react";
import {Button, Group, Tabs, Text} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";
import Markdown from "react-markdown";
import Page from "../Page.tsx";
import Header from "../components/controls/Header.tsx";
import Description from "../components/controls/Description.tsx";
import {FaGitAlt} from "react-icons/fa";
import { Trans } from 'react-i18next';

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
            <Header text={t("view.home.title")}/>
            <Description text={<Trans i18nKey="view.home.description" />}/>

            <Group gap={4} mt={"md"} mb={"xl"}>
                <Link to={"/scores/1"}>
                    <Button variant={"outline"}>{t("view.home.label.example")}</Button>
                </Link>
                <Link to={"/editor"}>
                    <Button variant={"outline"}>{t("view.home.label.experiment")}</Button>
                </Link>
            </Group>

            <Tabs defaultValue="changelog">
                <Tabs.List>
                    <Tabs.Tab value="changelog" leftSection={<FaGitAlt size={24}/>}>
                        <Text size={"lg"}>
                            {t("view.home.tab.changes")}
                        </Text>
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="changelog">
                    <Markdown>{changelog}</Markdown>
                </Tabs.Panel>
            </Tabs>
        </Page>
    );
}

export default Home;
