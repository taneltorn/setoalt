import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Badge, Button, Group, useMantineTheme} from "@mantine/core";
import useUserService from "../../../services/UserService.tsx";
import {DisplayError} from "../../../utils/helpers.tsx";
import {DialogType, useDialogContext} from "../../../context/DialogContext.tsx";
import {User} from "../../../models/User.ts";
import PaginatedTable, {Row} from "../../../components/table/PaginatedTable.tsx";
import {FaPencil, FaRegTrashCan} from "react-icons/fa6";
import {Role} from "../../../context/AuthContext.tsx";
import {BiPlus} from "react-icons/bi";
import SearchInput from "../../../components/controls/SearchInput.tsx";
import SaveUserDialog from "../dialog/SaveUserDialog.tsx";
import RemoveUserDialog from "../dialog/RemoveUserDialog.tsx";
import IconButton from "../../../components/controls/IconButton.tsx";
import ControlPanel from "../../../components/controls/ControlPanel.tsx";

const UserManagement: React.FC = () => {

    const {t} = useTranslation();
    const userService = useUserService();
    const {open} = useDialogContext();
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>(users);
    const theme = useMantineTheme();

    const fetchData = () => {
        userService.fetchUsers()
            .then(r => setUsers(r))
            .catch(() => DisplayError(
                t("toast.error.title"),
                t("toast.error.fetchData"),
            ));
    }

    const handleSearch = (value: string) => {
        setFilteredUsers(users.filter(r => r.username?.toLowerCase().includes(value.toLowerCase())
            || r.firstname?.toLowerCase().includes(value.toLowerCase())
            || r.lastname?.toLowerCase().includes(value.toLowerCase())));
    }

    useEffect(() => {
        fetchData();
        return () => userService.cancelSource.cancel();
    }, []);


    useEffect(() => {
        setFilteredUsers(users);
    }, [users]);

    return (
        <>
            <ControlPanel
                leftSection={
                    <SearchInput
                        onChange={handleSearch}
                        onClear={() => setFilteredUsers(users)}
                    />}
                rightSection={
                    <Button size={"md"}
                            variant={"outline"}
                            leftSection={<BiPlus size={24}/>}
                            onClick={() => open(DialogType.SAVE_USER, {onSave: () => fetchData()})}>
                        {t("button.addNew")}
                    </Button>}
            />

            <PaginatedTable
                isLoading={userService.isLoading}
                columns={[
                    t("view.admin.users.table.id"),
                    t("view.admin.users.table.name"),
                    t("view.admin.users.table.username"),
                    t("view.admin.users.table.role"),
                ]}
                rows={filteredUsers.map(user => ({
                    name: user.username,
                    data: [
                        user.id,
                        `${user.firstname || ""} ${user.lastname || ""}`,
                        user.username,
                        <Badge
                            bg={[Role.ADMIN, Role.EDITOR].includes(user.role) ? theme.primaryColor : theme.colors.gray[4]}>
                            {t(`role.${user.role.toLowerCase()}`)}
                        </Badge>,
                        <Group justify={"end"} gap={4}>
                            <IconButton
                                title={t("button.edit")}
                                icon={<FaPencil size={20}/>}
                                onClick={() => open(DialogType.SAVE_USER, {
                                    id: user.id,
                                    user: user,
                                    onSave: fetchData
                                })}
                            />

                            <IconButton
                                title={t("button.remove")}
                                icon={<FaRegTrashCan size={20}/>}
                                onClick={() => open(DialogType.REMOVE_SCORE, {
                                    id: user.id,
                                    username: user.username,
                                    onRemove: fetchData
                                })}
                            />
                        </Group>,
                    ]
                }) as Row)}
            />

            <SaveUserDialog/>
            <RemoveUserDialog/>
        </>
    );
}

export default UserManagement;
