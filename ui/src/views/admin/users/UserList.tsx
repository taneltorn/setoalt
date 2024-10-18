import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Button, Group,} from "@mantine/core";
import useUserService from "../../../hooks/useUserService.tsx";
import {DisplayError} from "../../../utils/helpers.tsx";
import {useDialogContext} from "../../../hooks/useDialogContext.tsx";
import {User} from "../../../model/User.ts";
import {DialogType} from "../../../utils/enums.ts";
import {BiPlus} from "react-icons/bi";
import SearchInput from "../../../components/controls/SearchInput.tsx";
import SaveUserDialog from "./components/SaveUserDialog.tsx";
import RemoveUserDialog from "./components/RemoveUserDialog.tsx";
import {Size} from "../../../utils/constants.ts";
import {usePagination} from "../../../hooks/usePagination.tsx";
import UserTable from "./components/UserTable.tsx";

const UserList: React.FC = () => {

    const {t} = useTranslation();

    const userService = useUserService();
    const {open} = useDialogContext();
    const {setPage} = usePagination();

    const [query, setQuery] = useState<string>("");
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>(users);

    const fetchData = () => {
        userService.fetchUsers()
            .then(r => setUsers(r))
            .catch(() => DisplayError(t("toast.error.fetchData")));
    }

    const handleSearch = (value: string) => {
        setQuery(value);
        setPage(1);

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
        handleSearch(query);
    }, [users, query]);

    return (
        <>
            <Group justify={"space-between"} mb={"md"}>
                <SearchInput
                    value={query}
                    onChange={handleSearch}
                    onClear={() => handleSearch("")}
                />
                <Button size={"md"}
                        variant={"outline"}
                        leftSection={<BiPlus size={Size.icon.SM}/>}
                        onClick={() => open(DialogType.SAVE_USER, {onSave: () => fetchData()})}>
                    {t("button.addNew")}
                </Button>
            </Group>

            <UserTable users={filteredUsers} onChange={fetchData}/>

            <SaveUserDialog/>
            <RemoveUserDialog/>
        </>
    );
}

export default UserList;
