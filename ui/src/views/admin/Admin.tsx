import React from "react";
import {useTranslation} from "react-i18next";
import {Tabs, Text} from "@mantine/core";
import Page from "../../Page.tsx";
import UserManagement from "./panel/UserManagement.tsx";
import {FaUser} from "react-icons/fa";
import {IoMdSettings} from "react-icons/io";
import Header from "../../components/controls/Header.tsx";
import Description from "../../components/controls/Description.tsx";

const Admin: React.FC = () => {

    const {t} = useTranslation();

    return (
        <Page title={t("view.admin.title")}>
            <Header text={t("view.admin.title")}/>
            <Description text={t("view.admin.description")}/>

            <Tabs defaultValue="users">
                <Tabs.List>
                    <Tabs.Tab value="users" leftSection={<FaUser size={24}/>}>
                        <Text size={"lg"}>
                            {t("view.admin.tab.users")}
                        </Text>
                    </Tabs.Tab>

                    <Tabs.Tab value="settings" leftSection={<IoMdSettings size={24}/>}>
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
