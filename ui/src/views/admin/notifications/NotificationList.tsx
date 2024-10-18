import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Button, Group} from "@mantine/core";
import {DisplayError} from "../../../utils/helpers.tsx";
import {useDialogContext} from "../../../hooks/useDialogContext.tsx";
import {BiPlus} from "react-icons/bi";
import {Size} from "../../../utils/constants.ts";
import {Notification} from "../../../model/Notification.ts";
import SearchInput from "../../../components/controls/SearchInput.tsx";
import SaveNotificationDialog from "./components/SaveNotificationDialog.tsx";
import RemoveNotificationDialog from "./components/RemoveNotificationDialog.tsx";
import useNotificationService from "../../../hooks/useNotificationService.tsx";
import {DialogType} from "../../../utils/enums.ts";
import {usePagination} from "../../../hooks/usePagination.tsx";
import NotificationTable from "./NotificationTable.tsx";

const NotificationList: React.FC = () => {

    const {t} = useTranslation();

    const notificationService = useNotificationService();

    const {open} = useDialogContext();
    const {setPage} = usePagination();

    const [query, setQuery] = useState<string>("");
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>(notifications);

    const fetchData = () => {
        notificationService.fetchNotifications()
            .then(r => setNotifications(r))
            .catch(() => DisplayError(t("toast.error.fetchData")));
    }

    const handleSearch = (value: string) => {
        setQuery(value);
        setPage(1);

        const query = value?.toLowerCase();
        setFilteredNotifications(notifications.filter(r => r.message?.toLowerCase().includes(query)));
    }


    useEffect(() => {
        handleSearch(query);
    }, [notifications, query]);


    useEffect(() => {
        fetchData();
        return () => notificationService.cancelSource.cancel();
    }, []);

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
                        onClick={() => open(DialogType.SAVE_NOTIFICATION, {
                            onSave: () => fetchData()
                        })}>
                    {t("button.addNew")}
                </Button>
            </Group>

            <NotificationTable
                notifications={filteredNotifications}
                onChange={fetchData}
            />

            <SaveNotificationDialog/>
            <RemoveNotificationDialog/>
        </>
    );
}

export default NotificationList;
