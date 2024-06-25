import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import Markdown from "react-markdown";
import Page from "../Page.tsx";
import Header from "../components/controls/Header.tsx";

const ChangeLog: React.FC = () => {

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
        <Page title={t("view.changelog.pageTitle")}>
            <Header>
                {t("view.changelog.title")}
            </Header>

            <Markdown>{changelog}</Markdown>
        </Page>
    );
}

export default ChangeLog;
