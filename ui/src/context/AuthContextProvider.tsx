import React, {useState, ReactNode, useEffect, useMemo} from 'react';
import {AuthContext, Role, UserDetails} from './AuthContext';
import {DisplayError} from "../utils/helpers.tsx";
import {useTranslation} from "react-i18next";

const API_URL = import.meta.env.VITE_API_URL;

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthContextProvider: React.FC<AuthProviderProps> = ({children}) => {

    const {t} = useTranslation();
    const [isInitialized, setIsInitialized] = useState<boolean>(false);
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
                    setCurrentUser({
                        ...data.user,
                        isAuthorized: [Role.ADMIN, Role.EDITOR].includes(data.user.role),
                        isAdmin: Role.ADMIN === data.user.role
                    });
                    return data;
                } else {
                    DisplayError(t("toast.error.title"), t("toast.error.wrongCredentials"));
                }
            })
            .catch(() => {
                DisplayError(t("toast.error.title"), t("toast.error.message"));
                setCurrentUser(null);
            });
    }

    const logout = async (): Promise<any> => {
        try {
            await fetch(`${API_URL}/auth/logout`, {
                method: "POST",
                credentials: "include"
            });
            setCurrentUser(null);
        } catch (e) {
            DisplayError(t("toast.error.title"), t("toast.error.message"));
            setCurrentUser(null);
        }
    }

    const verify = async () => {
        fetch(`${API_URL}/auth/verify`, {
            credentials: "include"
        })
            .then(response => response.json())
            .then((data) => {
                if (data.user) {
                    setCurrentUser({
                        ...data.user,
                        isAuthorized: [Role.ADMIN, Role.EDITOR].includes(data.user.role),
                        isAdmin: Role.ADMIN === data.user.role
                    });
                    return;
                } else {
                    setCurrentUser(null);
                }
            })
            .catch(() => {
                DisplayError(t("toast.error.title"), t("toast.error.message"));
                setCurrentUser(null);
            });
    }

    useEffect(() => {
        verify().then(() => setIsInitialized(true));
    }, []);

    const context = useMemo(() => ({
        currentUser,
        login,
        logout,
        verify,
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
