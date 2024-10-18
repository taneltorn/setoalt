import React, {useEffect, useState} from 'react';
import {Notification} from "./model/Notification.ts";
import {Alert, Text, Title} from "@mantine/core";
import {Size} from "./utils/constants.ts";
import {FaInfoCircle} from "react-icons/fa";
import useNotificationService from "./hooks/useNotificationService.tsx";

const NotificationPanel: React.FC = () => {

    const notificationService = useNotificationService();
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        notificationService.fetchActiveNotifications()
            .then(response => {
                setNotifications(response);
            });
    }, []);

    return (
        <>
            {notifications.map((n, i) => (
                <Alert key={i} radius={"sm"} mb={"xs"} color={"blue"} icon={<FaInfoCircle size={Size.icon.MD}/>}>
                    <Title order={4} mb={"xs"}>{n.title}</Title>
                    <Text>{n.message}</Text>
                </Alert>
            ))}
        </>
    );
}

export default NotificationPanel;
