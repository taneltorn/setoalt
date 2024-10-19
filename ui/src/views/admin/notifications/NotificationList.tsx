import React, {useMemo} from "react";
import {useTranslation} from "react-i18next";
import {Button, Group} from "@mantine/core";
import {useDialogContext} from "../../../hooks/useDialogContext.tsx";
import {BiPlus} from "react-icons/bi";
import {Size} from "../../../utils/constants.ts";
import SearchInput from "../../../components/controls/SearchInput.tsx";
import SaveNotificationDialog from "./components/SaveNotificationDialog.tsx";
import RemoveNotificationDialog from "./components/RemoveNotificationDialog.tsx";
import {DialogType} from "../../../utils/enums.ts";
import useNotificationData from "./hooks/useNotificationData.tsx";
import useSearchQuery from "../../../hooks/useSearchQuery.tsx";
import PaginatedTable from "../../../components/table/PaginatedTable.tsx";
import NotificationRow from "./components/NotificationRow.tsx";

const NotificationList: React.FC = () => {

    const {t} = useTranslation();

    const {open} = useDialogContext();
    const {notifications, fetchNotifications, isLoading} = useNotificationData();
    const {query, setQuery} = useSearchQuery();

    const filteredNotifications = useMemo(() => {
        const lowerCaseQuery = query.toLowerCase();
        return notifications.filter(notification =>
            notification.message?.toLowerCase().includes(lowerCaseQuery) ||
            notification.title?.toLowerCase().includes(lowerCaseQuery)
        );
    }, [notifications, query]);

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
                            onSave: () => fetchNotifications()
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
                rows={filteredNotifications.map(n => <NotificationRow notification={n} onChange={fetchNotifications}/>)}
            />

            <SaveNotificationDialog/>
            <RemoveNotificationDialog/>
        </>
    );
}

export default NotificationList;
