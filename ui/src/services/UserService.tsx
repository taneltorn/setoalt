import {useState} from "react";
import axios from 'axios';
import {User} from "../model/User.ts";

const API_URL = import.meta.env.VITE_API_URL;

const useUserService = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const cancelSource = axios.CancelToken.source();

    const fetchUsers = async (): Promise<User[]> => {
        setIsLoading(true);
        return axios.get(`${API_URL}/api/users`, {
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

    const createUser = async (user: User): Promise<User> => {
        setIsLoading(true);
        return axios.post(`${API_URL}/api/users`, user, {
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

    const updateUser = async (id: number, user: User): Promise<User> => {
        setIsLoading(true);
        return axios.patch(`${API_URL}/api/users/${id}`, user, {
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

    const removeUser = async (id: number): Promise<User> => {
        setIsLoading(true);
        return axios.delete(`${API_URL}/api/users/${id}`, {
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
        fetchUsers,
        createUser,
        updateUser,
        removeUser,
        cancelSource
    }
};

export default useUserService;
