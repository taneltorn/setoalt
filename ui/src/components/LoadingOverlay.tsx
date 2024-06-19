import React from "react";
import {Center, Loader, Text} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {Layout} from "../utils/constants.ts";

interface Properties {
    isLoading: boolean;
    text?: string;
    hideText?: boolean;
    children: React.ReactNode;
}

const LoadingOverlay: React.FC<Properties> = ({isLoading, text, hideText, children}) => {

    const {t} = useTranslation();

    return (
        <>
            {isLoading
                ? <Center mt={"xl"} style={{maxWidth: Layout.stave.container.MAX_WIDTH}}>
                    <Loader/> {!hideText && <Text ml={"md"}>{text || t("page.loading")}</Text>}
                </Center>
                : children}
        </>
    );
}

export default LoadingOverlay;
