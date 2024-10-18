import React from "react";
import {useTranslation} from "react-i18next";
import {Badge} from "@mantine/core";
import {DateFormat} from "../../../utils/constants.ts";
import {Notification} from "../../../model/Notification.ts";
import useNotificationService from "../../../hooks/useNotificationService.tsx";
import DataTable from "../../../components/table/DataTable.tsx";
import {Row} from "../../../model/Row.ts";
import NotificationControls from "./NotificationControls.tsx";
import moment from "moment";
import {isActive} from "../../../utils/helpers.tsx";

interface Properties {
    notifications: Notification[];
    onChange: () => void;
}

const NotificationTable: React.FC<Properties> = ({notifications, onChange}) => {

    const {t} = useTranslation();

    const notificationService = useNotificationService();

    return (
        <DataTable
            isLoading={notificationService.isLoading}
            headers={[
                t("view.admin.notifications.id"),
                t("view.admin.notifications.title"),
                t("view.admin.notifications.message"),
                t("view.admin.notifications.validFrom"),
                t("view.admin.notifications.validTo"),
                t("view.admin.notifications.status"),
            ]}
            rows={notifications.map(notification => ({
                name: `${notification.id}`,
                data: [
                    notification.id,
                    notification.title,
                    notification.message,
                    notification.validFrom ? moment(notification.validFrom).format(DateFormat) : "",
                    notification.validTo ? moment(notification.validTo).format(DateFormat) : "",
                    <Badge color={isActive(notification) ? "green" : "gray.5"}>
                        {t(`view.admin.notifications.${isActive(notification) ? "active" : "inactive"}`)}
                    </Badge>,
                    <NotificationControls notification={notification} onChange={onChange}/>
                ]
            }) as Row)}
        />
    );
}

export default NotificationTable;
