import React from 'react';
import {Group} from "@mantine/core";
import {useAuth} from "../hooks/useAuth.tsx";
import {FaUser} from "react-icons/fa";
import {CiUser} from "react-icons/ci";
import {Size} from "../utils/constants.ts";
import {Link} from "react-router-dom";

interface Properties {
    onClick?: () => void;
}


const ProfileLink: React.FC<Properties> = (props) => {

    const auth = useAuth();

    return (
        <Group gap={"xs"}>
            {auth.currentUser
                ? <Link to={"/profile"} onClick={props.onClick}><FaUser size={Size.icon.XS}/></Link>
                : <CiUser size={Size.icon.XS}/>}
        </Group>
    );
}

export default ProfileLink;
