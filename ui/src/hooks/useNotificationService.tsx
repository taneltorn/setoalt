import {useState} from "react";
import {Notification} from "../model/Notification.ts";
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const useNotificationService = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const cancelSource = axios.CancelToken.source();

    const fetchNotification = async (id: string): Promise<Notification> => {
        setIsLoading(true);
        return axios.get(`${API_URL}/api/notifications/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        })
            .then(response => {
                setIsLoading(false);
                return response.data;
            })
            .catch(error => {
                setIsLoading(false);
                throw error;
            });
    }

    const fetchNotifications = async (): Promise<Notification[]> => {
        setIsLoading(true);
        return axios.get(`${API_URL}/api/notifications`, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        })
            .then(response => {
                setIsLoading(false);
                return response.data;
            })
            .catch(error => {
                setIsLoading(false);
                throw error;
            });
    }

    const fetchActiveNotifications = async (): Promise<Notification[]> => {
        setIsLoading(true);
        return axios.get(`${API_URL}/api/notifications/active`, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        })
            .then(response => {
                setIsLoading(false);
                return response.data;
            })
            .catch(error => {
                setIsLoading(false);
                throw error;
            });
    }

    const createNotification = async (notification: Notification): Promise<Notification> => {
        setIsLoading(true);
        return axios.post(`${API_URL}/api/notifications`, notification, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        })
            .then(response => {
                setIsLoading(false);
                return response.data;
            })
            .catch(error => {
                setIsLoading(false);
                throw error;
            });
    }

    const updateNotification = async (id: number, notification: Notification): Promise<Notification> => {
        setIsLoading(true);
        return axios.put(`${API_URL}/api/notifications/${id}`, notification, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        })
            .then(response => {
                setIsLoading(false);
                return response.data;
            })
            .catch(error => {
                setIsLoading(false);
                throw error;
            });
    }

    const removeNotification = async (id: number): Promise<number> => {
        setIsLoading(true);
        return axios.delete(`${API_URL}/api/notifications/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        })
            .then(response => {
                setIsLoading(false);
                return response.data;
            })
            .catch(error => {
                setIsLoading(false);
                throw error;
            });
    }

    return {
        isLoading,
        fetchNotification,
        fetchNotifications,
        fetchActiveNotifications,
        createNotification,
        updateNotification,
        removeNotification,
        cancelSource
    }
};

export default useNotificationService;
