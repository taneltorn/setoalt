import React, {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {Button, Group} from "@mantine/core";
import {useDialogContext} from "../../../hooks/useDialogContext.tsx";
import {BiPlus} from "react-icons/bi";
import {Size} from "../../../utils/constants.ts";
import SearchInput from "../../../components/controls/SearchInput.tsx";
import SaveNotificationDialog from "./components/SaveNotificationDialog.tsx";
import RemoveNotificationDialog from "./components/RemoveNotificationDialog.tsx";
import {DialogType} from "../../../utils/enums.ts";
import useSearchQuery from "../../../hooks/useSearchQuery.tsx";
import PaginatedTable from "../../../components/table/PaginatedTable.tsx";
import NotificationRow from "./components/NotificationRow.tsx";
import useNotificationService from "../../../hooks/useNotificationService.tsx";
import {Notification} from "../../../model/Notification.ts";

const NotificationList: React.FC = () => {

    const {t} = useTranslation();
    const {open} = useDialogContext();
    const {query, setQuery} = useSearchQuery();
    const {fetchNotifications, isLoading, cancelSource} =useNotificationService();

    const [notifications, setNotifications] = useState<Notification[]>([]);

    const fetchData = () => fetchNotifications().then(setNotifications);

    const filteredNotifications = useMemo(() => {
        const lowerCaseQuery = query.toLowerCase();
        return notifications.filter(notification =>
            notification.message?.toLowerCase().includes(lowerCaseQuery) ||
            notification.title?.toLowerCase().includes(lowerCaseQuery)
        );
    }, [notifications, query]);

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

                <Button size={"md"}
                        variant={"outline"}
                        leftSection={<BiPlus size={Size.icon.SM}/>}
                        onClick={() => open(DialogType.SAVE_NOTIFICATION, {
                            onSave: fetchData
                        })}>
                    {t("button.addNew")}
                </Button>
            </Group>

            <PaginatedTable
                isLoading={isLoading}
                headers={[
                    t("view.admin.notifications.id"),
                    t("view.admin.notifications.title"),
                    t("view.admin.notifications.message"),
                    t("view.admin.notifications.validFrom"),
                    t("view.admin.notifications.validTo"),
                    t("view.admin.notifications.status"),
                ]}
                rows={filteredNotifications.map((notification) =>
                    <NotificationRow
                        key={notification.id}
                        notification={notification}
                        onChange={fetchData}
                    />)}
            />

            <SaveNotificationDialog/>
            <RemoveNotificationDialog/>
        </>
    );
}

export default NotificationList;
