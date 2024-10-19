import React, {useMemo} from "react";
import {useTranslation} from "react-i18next";
import {Button, Group} from "@mantine/core";
import {useDialogContext} from "../../../hooks/useDialogContext.tsx";
import {DialogType} from "../../../utils/enums.ts";
import {BiPlus} from "react-icons/bi";
import SearchInput from "../../../components/controls/SearchInput.tsx";
import SaveUserDialog from "./components/SaveUserDialog.tsx";
import RemoveUserDialog from "./components/RemoveUserDialog.tsx";
import {Size} from "../../../utils/constants.ts";
import useUserData from "./hooks/useUserData.tsx";
import PaginatedTable from "../../../components/table/PaginatedTable.tsx";
import UserRow from "./components/UserRow.tsx";
import useSearchQuery from "../../../hooks/useSearchQuery.tsx";

const UserList: React.FC = () => {

    const {t} = useTranslation();

    const {open} = useDialogContext();
    const {users, fetchUsers, isLoading} = useUserData();
    const {query, setQuery} = useSearchQuery();

    const filteredUsers = useMemo(() => {
        const lowerCaseQuery = query.toLowerCase();
        return users.filter(user =>
            user.username?.toLowerCase().includes(lowerCaseQuery) ||
            user.firstname?.toLowerCase().includes(lowerCaseQuery) ||
            user.lastname?.toLowerCase().includes(lowerCaseQuery)
        );
    }, [users, query]);

    return (
        <>
            <Group justify={"space-between"} mb={"md"}>
                <SearchInput
                    value={query}
                    onChange={setQuery}
                    onClear={() => setQuery("")}
                />
                <Button
                    size={"md"}
                    variant={"outline"}
                    leftSection={<BiPlus size={Size.icon.SM}/>}
                    onClick={() => open(DialogType.SAVE_USER, {onSave: () => fetchUsers()})}
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
                rows={filteredUsers.map(user => <UserRow user={user} onChange={fetchUsers}/>)}
            />

            <SaveUserDialog/>
            <RemoveUserDialog/>
        </>
    );
}

export default UserList;
