import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import useUserService from "../../../../hooks/useUserService.tsx";
import {User} from "../../../../model/User.ts";
import {DisplayError} from "../../../../utils/helpers.tsx";

const useUserData = () => {

    const {t} = useTranslation();
    const userService = useUserService();

    const [users, setUsers] = useState<User[]>([]);

    const fetchUsers = () => {
        userService.fetchUsers()
            .then(setUsers)
            .catch(() => DisplayError(t("toast.error.fetchData")));
    };

    useEffect(() => {
        fetchUsers();
        return () => userService.cancelSource.cancel();
    }, []);

    return {
        users,
        fetchUsers,
        isLoading: userService.isLoading
    };
}

export default useUserData;