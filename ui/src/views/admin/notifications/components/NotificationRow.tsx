import React from "react";
import {useTranslation} from "react-i18next";
import {Badge, Table} from "@mantine/core";
import {DateFormat} from "../../../../utils/constants.ts";
import moment from "moment";
import NotificationRowControls from "./NotificationRowControls.tsx";
import {isActive} from "../../../../utils/helpers.tsx";
import {Notification} from "../../../../model/Notification.ts";

interface Properties {
    notification: Notification;
    onChange: () => void;
}

const NotificationRow: React.FC<Properties> = ({notification, onChange}) => {

    const {t} = useTranslation();

    return (
        <Table.Tr>
            <Table.Td>{notification.id}</Table.Td>
            <Table.Td>{notification.title}</Table.Td>
            <Table.Td>{notification.message}</Table.Td>
            <Table.Td>{notification.validFrom ? moment(notification.validFrom).format(DateFormat) : ""}</Table.Td>
            <Table.Td>{notification.validTo ? moment(notification.validTo).format(DateFormat) : ""}</Table.Td>
            <Table.Td>
                <Badge color={isActive(notification) ? "green" : "gray.5"}>
                    {t(`view.admin.notifications.${isActive(notification) ? "active" : "inactive"}`)}
                </Badge>
            </Table.Td>
            <Table.Td>
                <NotificationRowControls notification={notification} onChange={onChange}/>
            </Table.Td>
        </Table.Tr>
    );
}

export default NotificationRow;
