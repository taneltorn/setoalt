import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {DisplayError} from "../../../../utils/helpers.tsx";
import {Notification} from "../../../../model/Notification.ts";
import useNotificationService from "../../../../hooks/useNotificationService.tsx";

const useNotificationData = () => {

    const {t} = useTranslation();
    const notifcationService = useNotificationService();

    const [notifications, setNotifications] = useState<Notification[]>([]);

    const fetchNotifications = () => {
        notifcationService.fetchNotifications()
            .then(setNotifications)
            .catch(() => DisplayError(t("toast.error.fetchData")));
    };

    useEffect(() => {
        fetchNotifications();
        return () => notifcationService.cancelSource.cancel();
    }, []);

    return {
        notifications,
        fetchNotifications,
        isLoading: notifcationService.isLoading
    };
}

export default useNotificationData;