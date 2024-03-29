import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Button, Grid, Text, Title} from "@mantine/core";
import useUserService from "../services/UserService.tsx";
import {DisplayError} from "../utils/helpers.tsx";
import UserTable from "../components/table/UserTable.tsx";
import SaveUserDialog from "../components/dialog/SaveUserDialog.tsx";
import {DialogType, useDialogContext} from "../context/DialogContext.tsx";
import {User} from "../models/User.ts";
import RemoveUserDialog from "../components/dialog/RemoveUserDialog.tsx";
import Page from "../Page.tsx";

const Admin: React.FC = () => {

    const {t} = useTranslation();
    const userService = useUserService();
    const {open} = useDialogContext();
    const [users, setUsers] = useState<User[]>([]);

    const fetchData = () => {
        userService.fetchUsers()
            .then(r => setUsers(r))
            .catch(() => DisplayError(
                t("toast.error.title"),
                t("toast.error.fetchData"),
            ));
    }

    useEffect(() => {
        fetchData();
        return () => userService.cancelSource.cancel();
    }, []);

    return (
        <Page title={t("view.admin.title")}>
            <Title order={1} mb={"xs"}>{t("view.admin.title")}</Title>
            <Text>{t("view.admin.description")} </Text>

            <Grid>
                <Grid.Col span={{xl: 10, lg: 12}}>
                    <UserTable users={users} refresh={fetchData}/>
                </Grid.Col>
            </Grid>

            <Button mt={"md"} onClick={() => open(DialogType.SAVE_USER, {onSave: () => fetchData()})}>
                {t("button.addNew")}
            </Button>

            <SaveUserDialog/>
            <RemoveUserDialog/>
        </Page>
    );
}

export default Admin;
