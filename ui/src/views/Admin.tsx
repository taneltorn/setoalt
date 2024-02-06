import React from "react";
import {useTranslation} from "react-i18next";
import {Text, Title} from "@mantine/core";

const Admin: React.FC = () => {

    const {t} = useTranslation();

    return (
        <>

            <Title order={1} mb={"xs"}>{t("view.admin.title")}</Title>
            <Text>{t("view.admin.description")} </Text>
        </>
    );
}

export default Admin;
