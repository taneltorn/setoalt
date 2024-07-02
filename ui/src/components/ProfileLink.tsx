import React from 'react';
import {Group} from "@mantine/core";
import {useAuth} from "../hooks/useAuth.tsx";
import {FaUser} from "react-icons/fa";
import {CiUser} from "react-icons/ci";
import {Size} from "../utils/constants.ts";
import {useTranslation} from "react-i18next";

const ProfileLink: React.FC = () => {

    const {t} = useTranslation();
    const auth = useAuth();

    return (
        <Group gap={"xs"}>
            {auth.currentUser
                ? <FaUser size={Size.icon.XS}/>
                : <CiUser size={Size.icon.XS}/>}
            {auth.currentUser?.username || t("role.guest")}
        </Group>
    );
}

export default ProfileLink;
