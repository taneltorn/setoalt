import React from "react";
import {Button, Menu, Text} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {Language} from "../model/Language.ts";

const normalizeLng = (lng: string): Language => {
    const base = lng.split("-")[0];

    if (base === Language.ET) return Language.ET;

    return Language.EN;
};

const LanguageSelector: React.FC = () => {
    const {t, i18n} = useTranslation();

    const current = normalizeLng(i18n.resolvedLanguage ?? i18n.language);

    const changeLanguage = (lng: Language) => {
        i18n.changeLanguage(lng).then(() => localStorage.setItem("lang", lng));
    };

    return (
        <Menu shadow="md">
            <Button
                px="xs"
                size="xl"
                color="gray"
                onClick={() => changeLanguage(current === Language.ET ? Language.EN : Language.ET)}
                variant="transparent"
                title={t("page.selectLanguage")}
            >
                <Text size={"xs"} fw={"bold"}>
                    {t("page.sidebar.switchLang")}
                </Text>
            </Button>

        </Menu>
    );
};

export default LanguageSelector;