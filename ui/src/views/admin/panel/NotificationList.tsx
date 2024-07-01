import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Badge, Button, Group} from "@mantine/core";
import {DateFormatter, DisplayError, isActive} from "../../../utils/helpers.tsx";
import {DialogType, useDialogContext} from "../../../context/DialogContext.tsx";
import PaginatedTable, {Row} from "../../../components/table/PaginatedTable.tsx";
import {FaPencil, FaRegTrashCan} from "react-icons/fa6";
import {BiPlus} from "react-icons/bi";
import IconButton from "../../../components/controls/IconButton.tsx";
import {Size} from "../../../utils/constants.ts";
import {Notification} from "../../../model/Notification.ts";
import usePagination from "../../../hooks/usePagination.tsx";
import SearchInput from "../../../components/controls/SearchInput.tsx";
import SaveNotificationDialog from "../dialog/SaveNotificationDialog.tsx";
import RemoveNotificationDialog from "../dialog/RemoveNotificationDialog.tsx";
import useNotificationService from "../../../hooks/useNotificationService.tsx";

const NotificationList: React.FC = () => {

    const {t} = useTranslation();
    const notificationService = useNotificationService();
    const {open} = useDialogContext();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>(notifications);
    const {pagination, setPagination} = usePagination();

    const fetchData = () => {
        notificationService.fetchNotifications()
            .then(r => setNotifications(r))
            .catch(() => DisplayError(t("toast.error.fetchData")));
    }

    const handleSearch = (value: string) => {
        const query = value?.toLowerCase();
        setFilteredNotifications(notifications.filter(r => r.message?.toLowerCase().includes(query)));
    }


    useEffect(() => {
        handleSearch(pagination.query);
    }, [notifications]);


    useEffect(() => {
        fetchData();
        return () => notificationService.cancelSource.cancel();
    }, []);

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
                        onClick={() => open(DialogType.SAVE_NOTIFICATION, {
                            onSave: () => fetchData()
                        })}>
                    {t("button.addNew")}
                </Button>
            </Group>

            <PaginatedTable
                isLoading={notificationService.isLoading}
                onChange={handleSearch}
                pagination={pagination}
                setPagination={setPagination}
                columns={[
                    t("view.admin.notifications.id"),
                    t("view.admin.notifications.title"),
                    t("view.admin.notifications.message"),
                    t("view.admin.notifications.validFrom"),
                    t("view.admin.notifications.validTo"),
                    t("view.admin.notifications.status"),
                ]}
                rows={filteredNotifications.map(notification => ({
                    // name: notification.id,
                    data: [
                        notification.id,
                        notification.title,
                        notification.message,
                        notification.validFrom ? DateFormatter.format(new Date(notification.validFrom)) : "",
                        notification.validTo ? DateFormatter.format(new Date(notification.validTo)) : "",
                        <Badge color={isActive(notification) ? "green" : "gray.5"}>
                            {t(`view.admin.notifications.${isActive(notification) ? "active" : "inactive"}`)}
                        </Badge>,
                        <Group justify={"end"} gap={4}>
                            <IconButton
                                title={t("button.edit")}
                                icon={<FaPencil size={Size.icon.XS}/>}
                                onClick={() => open(DialogType.SAVE_NOTIFICATION, {
                                    notification: notification,
                                    onSave: fetchData
                                })}
                            />

                            <IconButton
                                title={t("button.remove")}
                                icon={<FaRegTrashCan size={Size.icon.XS}/>}
                                onClick={() => open(DialogType.REMOVE_NOTIFICATION, {
                                    notification: notification,
                                    onRemove: fetchData
                                })}
                            />
                        </Group>,
                    ]
                }) as Row)}
            />

            <SaveNotificationDialog/>
            <RemoveNotificationDialog/>
        </>
    );
}

export default NotificationList;
