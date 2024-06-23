import React from "react";
import {Box, Button, Text} from "@mantine/core";
import {useTranslation} from "react-i18next";
import Page from "../Page.tsx";
import {TbError404} from "react-icons/tb";
import {Link} from "react-router-dom";

const Error: React.FC = () => {

    const {t} = useTranslation();

    return (

        <Page title={t("view.error.title")}>
            <Box className={"errorContainer"} p={"xl"}>
                <TbError404 size={200}/>

                <Text fz={48} mb={"xl"}>
                    {t("view.error.description")}
                </Text>

                <Link to={"/"}>
                    <Button size={"xl"}>
                        {t("view.error.returnToHome")}
                    </Button>
                </Link>
            </Box>
        </Page>
    );
}

export default Error;
