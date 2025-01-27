import React, {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {Button, Group} from "@mantine/core";
import {useDialogContext} from "../../../hooks/useDialogContext.tsx";
import {DialogType} from "../../../utils/enums.ts";
import {BiPlus} from "react-icons/bi";
import SearchInput from "../../../components/controls/SearchInput.tsx";
import SaveUserDialog from "./components/SaveUserDialog.tsx";
import RemoveUserDialog from "./components/RemoveUserDialog.tsx";
import {Size} from "../../../utils/constants.ts";
import PaginatedTable from "../../../components/table/PaginatedTable.tsx";
import UserRow from "./components/UserRow.tsx";
import useSearchQuery from "../../../hooks/useSearchQuery.tsx";
import {User} from "../../../model/User.ts";
import useUserService from "../../../hooks/useUserService.tsx";

const UserList: React.FC = () => {

    const {t} = useTranslation();
    const {open} = useDialogContext();
    const {fetchUsers, isLoading, cancelSource} = useUserService();

    const [users, setUsers] = useState<User[]>([]);
    const {query, setQuery} = useSearchQuery();

    const fetchData = () => fetchUsers().then(setUsers);

    const filteredUsers = useMemo(() => {
        const lowerCaseQuery = query.toLowerCase();
        return users.filter(user =>
            user.username?.toLowerCase().includes(lowerCaseQuery) ||
            user.firstname?.toLowerCase().includes(lowerCaseQuery) ||
            user.lastname?.toLowerCase().includes(lowerCaseQuery)
        );
    }, [users, query]);


    useEffect(() => {
        fetchData();
        return () => cancelSource.cancel();
    }, []);

    return (
        <>
            <Group justify={"space-between"} mb={"md"}>
                <SearchInput
                    value={query}
                    onChange={setQuery}
                    onClear={() => setQuery("")}
                />
                <Button
                    size={"sm"}
                    variant={"outline"}
                    leftSection={<BiPlus size={Size.icon.SM}/>}
                    onClick={() => open(DialogType.SAVE_USER, {onSave: fetchData})}
                >
                    {t("button.addNew")}
                </Button>
            </Group>

            <PaginatedTable
                isLoading={isLoading}
                headers={[
                    t("view.admin.users.table.id"),
                    t("view.admin.users.table.username"),
                    t("view.admin.users.table.name"),
                    t("view.admin.users.table.role"),
                    t("view.admin.users.table.createdAt"),
                ]}
                rows={filteredUsers.map((user) =>
                    <UserRow
                        key={user.id}
                        user={user}
                        onChange={fetchData}
                    />)}
            />

            <SaveUserDialog/>
            <RemoveUserDialog/>
        </>
    );
}

export default UserList;
