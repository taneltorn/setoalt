import {useState} from "react";
import axios from 'axios';
import {User} from "../models/User.ts";

const API_URL = import.meta.env.VITE_API_URL;

const useUserService = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const cancelSource = axios.CancelToken.source();

    // const fet = async (id: string): Promise<Score> => {
    //     setIsLoading(true);
    //     return axios.get(`${API_URL}/scores/${id}`, {
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         withCredentials: true
    //     })
    //         .then(response => {
    //             setIsLoading(false);
    //             return response.data;
    //         })
    //         .catch(error => {
    //             setIsLoading(false);
    //             throw error;
    //         });
    // }


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
        return axios.delete(`${API_URL}/users/${id}`, {
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
        removeUser,
        cancelSource
    }
};

export default useUserService;
