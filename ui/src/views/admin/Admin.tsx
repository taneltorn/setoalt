import React from "react";
import {useTranslation} from "react-i18next";
import {Tabs, Text} from "@mantine/core";
import Page from "../../Page.tsx";
import UserList from "./users/UserList.tsx";
import {FaUser} from "react-icons/fa";
import {IoMdSettings} from "react-icons/io";
import Header from "../../components/controls/Header.tsx";
import {Size} from "../../utils/constants.ts";
import NotificationList from "./notifications/NotificationList.tsx";

const Admin: React.FC = () => {

    const {t} = useTranslation();

    return (
        <Page title={t("view.admin.title")}>
            <Header>{t("view.admin.title")}</Header>

            <Tabs defaultValue="users" radius={"xs"}>
                <Tabs.List>
                    <Tabs.Tab value="users" leftSection={<FaUser size={Size.icon.SM}/>}>
                        <Text size={"lg"}>
                            {t("view.admin.tab.users")}
                        </Text>
                    </Tabs.Tab>

                    <Tabs.Tab value="notifications" leftSection={<IoMdSettings size={Size.icon.SM}/>}>
                        <Text size={"lg"}>
                            {t("view.admin.tab.notifications")}
                        </Text>
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="users" pt={"lg"}>
                    <UserList/>
                </Tabs.Panel>
                <Tabs.Panel value={"notifications"} pt={"lg"}>
                    <NotificationList/>
                </Tabs.Panel>
            </Tabs>
        </Page>
    );
}

export default Admin;
