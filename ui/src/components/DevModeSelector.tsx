import React from "react";
import {Switch} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {useDevMode} from "../hooks/useDevContext.tsx";

const DevModeSelector: React.FC = () => {

    const {t} = useTranslation();

    const {isDevMode, setIsDevMode} = useDevMode();

    return (
        <Switch
            size={"lg"}
            className={"hover-pointer"}
            checked={isDevMode}
            label={t(`page.sidebar.devMode`)}
            onChange={() => setIsDevMode(!isDevMode)}
        />
    );
};

export default DevModeSelector;