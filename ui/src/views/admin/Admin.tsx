import React from "react";
import {useTranslation} from "react-i18next";
import {Tabs, Text} from "@mantine/core";
import Page from "../../Page.tsx";
import UserManagement from "./panel/UserManagement.tsx";
import {FaUser} from "react-icons/fa";
import {IoMdSettings} from "react-icons/io";
import Header from "../../components/controls/Header.tsx";
import Description from "../../components/controls/Description.tsx";
import {Size} from "../../utils/constants.ts";

const Admin: React.FC = () => {

    const {t} = useTranslation();

    return (
        <Page title={t("view.admin.title")}>
            <Header>{t("view.admin.title")}</Header>
            <Description>{t("view.admin.description")}</Description>

            <Tabs defaultValue="users">
                <Tabs.List>
                    <Tabs.Tab value="users" leftSection={<FaUser size={Size.icon.SM}/>}>
                        <Text size={"lg"}>
                            {t("view.admin.tab.users")}
                        </Text>
                    </Tabs.Tab>

                    <Tabs.Tab value="settings" leftSection={<IoMdSettings size={Size.icon.SM}/>}>
                        <Text size={"lg"}>
                            {t("view.admin.tab.settings")}
                        </Text>
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="users" pt={"xl"}>
                    <UserManagement/>
                </Tabs.Panel>
                <Tabs.Panel value={"settings"} pt={"xl"}>
                    <Text>
                        Muud sätted
                    </Text>
                </Tabs.Panel>
            </Tabs>
        </Page>
    );
}

export default Admin;
