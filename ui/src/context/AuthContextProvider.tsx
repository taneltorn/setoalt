import React, {useState, ReactNode, useEffect, useMemo} from 'react';
import {AuthContext, UserDetails} from './AuthContext';
import {DisplayGlobalError} from "../utils/helpers.tsx";
import {useTranslation} from "react-i18next";

const API_URL = import.meta.env.VITE_API_URL;

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthContextProvider: React.FC<AuthProviderProps> = ({children}) => {

    const {t} = useTranslation();
    const [isInitialized, setIsInistialized] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<UserDetails | null>();

    const login = async (username: string, password: string): Promise<any> => {
        return fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "username": username,
                "password": password
            }),
            credentials: "include"
        })
            .then(response => response.json())
            .then(data => {
                if (data.token && data.user) {
                    setCurrentUser(data.user);
                    return data;
                } else {
                    DisplayGlobalError(t("toast.error.title"), t("toast.error.wrongCredentials"));
                }
            })
            .catch(() => {
                DisplayGlobalError(t("toast.error.title"), t("toast.error.message"));
                setCurrentUser(null);
            });
    }

    const logout = (): Promise<any> => {
        return fetch(`${API_URL}/auth/logout`, {
            method: "POST",
            credentials: "include"
        })
            .then(() => {
                setCurrentUser(null);
            })
            .catch(() => {
                DisplayGlobalError(t("toast.error.title"), t("toast.error.message"));
                setCurrentUser(null);
            });
    }

    const verify = async () => {
        fetch(`${API_URL}/auth/verify`, {
            credentials: "include"
        })
            .then(response => response.json())
            .then((data) => {
                if (data.user) {
                    setCurrentUser(data.user);
                    return;
                } else {
                    setCurrentUser(null);
                }
            })
            .catch(() => {
                DisplayGlobalError(t("toast.error.title"), t("toast.error.message"));
                setCurrentUser(null);
            });
    }

    useEffect(() => {
        verify().then(() => setIsInistialized(true));
    }, []);

    const context = useMemo(() => ({
        currentUser,
        login,
        logout,
        verify
    }), [currentUser, isInitialized]);

    return (
        <>
            {isInitialized && currentUser !== undefined &&
                <AuthContext.Provider value={context}>
                    {children}
                </AuthContext.Provider>}
        </>
    )
};
