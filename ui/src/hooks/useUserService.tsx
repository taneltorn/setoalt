import {useState} from "react";
import axios from 'axios';
import {User} from "../model/User.ts";
import {DisplayError, DisplaySuccess} from "../utils/helpers.tsx";
import {useTranslation} from "react-i18next";

const API_URL = import.meta.env.VITE_API_URL;

const useUserService = () => {

    const {t} = useTranslation();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const cancelSource = axios.CancelToken.source();

    const fetchUsers = async (): Promise<User[]> => {
        setIsLoading(true);
        return axios.get(`${API_URL}/users`, {
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
                DisplayError(t("toast.error.user.fetchUsers"), error);

                setIsLoading(false);
                throw error;
            });
    }

    const createUser = async (user: User): Promise<User> => {
        setIsLoading(true);
        return axios.post(`${API_URL}/users`, user, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        })
            .then(response => {
                DisplaySuccess(t("toast.success.user.saveUser"));

                setIsLoading(false);
                return response.data;
            })
            .catch(error => {
                DisplayError(t("toast.error.user.saveUser"), error);

                setIsLoading(false);
                throw error;
            });
    }

    const updateUser = async (id: number, user: User): Promise<User> => {
        setIsLoading(true);
        return axios.patch(`${API_URL}/users/${id}`, user, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        })
            .then(response => {
                DisplaySuccess(t("toast.success.user.saveUser"));

                setIsLoading(false);
                return response.data;
            })
            .catch(error => {
                DisplayError(t("toast.error.user.saveUser"), error);

                setIsLoading(false);
                throw error;
            });
    }


    const updateUserPassword = async (id: number, user: User): Promise<User> => {
        setIsLoading(true);
        return axios.patch(`${API_URL}/users/${id}/password`, user, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        })
            .then(response => {
                DisplaySuccess(t("toast.success.user.saveUser"));

                setIsLoading(false);
                return response.data;
            })
            .catch(error => {
                DisplayError(t("toast.error.user.saveUser"), error);

                setIsLoading(false);
                throw error;
            });
    }

    const removeUser = async (id: number): Promise<User> => {
        setIsLoading(true);
        return axios.delete(`${API_URL}/users/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        })
            .then(response => {
                DisplaySuccess(t("toast.success.user.removeUser"));

                setIsLoading(false);
                return response.data;
            })
            .catch(error => {
                DisplayError(t("toast.error.user.removeUser"), error);

                setIsLoading(false);
                throw error;
            });
    }

    return {
        isLoading,
        fetchUsers,
        createUser,
        updateUser,
        updateUserPassword,
        removeUser,
        cancelSource
    }
};

export default useUserService;
