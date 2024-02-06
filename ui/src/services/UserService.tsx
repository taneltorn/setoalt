import {useState} from "react";
import Cookies from 'js-cookie';
import {useNavigate} from "react-router-dom";
import {DisplayGlobalError} from "../utils/helpers.tsx";
import {useAuth} from "../context/AuthContext.tsx";

const API_URL = import.meta.env.VITE_API_URL;

const useUserService = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const auth = useAuth();

    const login = async (username: string, password: string) => {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "username": username ,
                "password": password
            }),
            credentials: "include"
        });


        const data = await response.json();
        if (response.ok) {

            // Cookies.set('token', data.token, { expires: 7, secure: false });
            navigate("/");
        } else {
            console.error('Login failed:', data.error);
            DisplayGlobalError("LOGFAIL", "WRONG");
        }
        setIsLoading(false);
    }

    const logout = () => {
        console.log("removing")
        Cookies.remove("token");
    }

    return {
        isLoading,
        login,
        logout
    }
};

export default useUserService;
