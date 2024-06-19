import React from "react";
import {useTranslation} from "react-i18next";
import {Tabs, Text, Title} from "@mantine/core";
import Page from "../../Page.tsx";
import UserManagement from "./panel/UserManagement.tsx";
import {FaUser} from "react-icons/fa";
import {IoMdSettings} from "react-icons/io";

const Admin: React.FC = () => {

    const {t} = useTranslation();

    return (
        <Page title={t("view.admin.title")}>
            <Title order={1} mb={"lg"}>
                {t("view.admin.title")}
            </Title>

            <Text mb={"lg"}>
                {t("view.admin.description")}
            </Text>

            <Tabs defaultValue="users">
                <Tabs.List>
                    <Tabs.Tab value="users" leftSection={<FaUser size={24}/>}>
                        <Text size={"lg"}>
                            Kasutajad
                        </Text>
                    </Tabs.Tab>

                    <Tabs.Tab value="other" leftSection={<IoMdSettings size={24}/>}>
                        <Text size={"lg"}>
                            Seaded
                        </Text>
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="users" pt={"xl"}>
                    <UserManagement/>
                </Tabs.Panel>
                <Tabs.Panel value={"other"} pt={"xl"}>
                    <Text>
                        Muud sätted
                    </Text>
                </Tabs.Panel>
            </Tabs>
        </Page>
    );
}

export default Admin;
