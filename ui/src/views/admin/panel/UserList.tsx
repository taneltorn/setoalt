import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Badge, Button, Group, useMantineTheme} from "@mantine/core";
import useUserService from "../../../hooks/useUserService.tsx";
import {DisplayError} from "../../../utils/helpers.tsx";
import {DialogType, useDialogContext} from "../../../context/DialogContext.tsx";
import {User} from "../../../model/User.ts";
import PaginatedTable, {Row} from "../../../components/table/PaginatedTable.tsx";
import {FaPencil, FaRegTrashCan} from "react-icons/fa6";
import {Role} from "../../../context/AuthContext.tsx";
import {BiPlus} from "react-icons/bi";
import SearchInput from "../../../components/controls/SearchInput.tsx";
import SaveUserDialog from "../dialog/SaveUserDialog.tsx";
import RemoveUserDialog from "../dialog/RemoveUserDialog.tsx";
import IconButton from "../../../components/controls/IconButton.tsx";
import {Size} from "../../../utils/constants.ts";
import usePagination from "../../../hooks/usePagination.tsx";

const UserList: React.FC = () => {

    const {t} = useTranslation();
    const userService = useUserService();
    const {open} = useDialogContext();
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>(users);
    const theme = useMantineTheme();
    const {pagination, setPagination} = usePagination();

    const fetchData = () => {
        userService.fetchUsers()
            .then(r => setUsers(r))
            .catch(() => DisplayError(t("toast.error.fetchData")));
    }

    const handleSearch = (value: string) => {
        const query = value?.toLowerCase();
        setFilteredUsers(users.filter(r => r.username?.toLowerCase().includes(query)
            || r.firstname?.toLowerCase().includes(query)
            || r.lastname?.toLowerCase().includes(query)));
    }

    useEffect(() => {
        fetchData();
        return () => userService.cancelSource.cancel();
    }, []);

    useEffect(() => {
        handleSearch(pagination.query);
    }, [users]);

    return (
        <>
            <Group justify={"space-between"} mb={"md"}>
                <SearchInput
                    value={pagination.query}
                    onChange={v => setPagination({...pagination, query: v, page: 1})}
                    onClear={() => setPagination({...pagination, query: "", page: 1})}
                />
                <Button size={"md"}
                        variant={"outline"}
                        leftSection={<BiPlus size={Size.icon.SM}/>}
                        onClick={() => open(DialogType.SAVE_USER, {onSave: () => fetchData()})}>
                    {t("button.addNew")}
                </Button>
            </Group>

            <PaginatedTable
                isLoading={userService.isLoading}
                onChange={handleSearch}
                pagination={pagination}
                setPagination={setPagination}
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
                                icon={<FaPencil size={Size.icon.XS}/>}
                                onClick={() => open(DialogType.SAVE_USER, {
                                    user: user,
                                    onSave: fetchData
                                })}
                            />

                            <IconButton
                                title={t("button.remove")}
                                icon={<FaRegTrashCan size={Size.icon.XS}/>}
                                onClick={() => open(DialogType.REMOVE_USER, {
                                    user: user,
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

export default UserList;
