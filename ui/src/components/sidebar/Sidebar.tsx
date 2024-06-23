import React from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {Box, Button, Divider, Group, NavLink} from "@mantine/core";
import classes from "./Sidebar.module.scss";
import {GiGClef} from "react-icons/gi";
import {PiSpeakerSimpleHigh} from "react-icons/pi";
import {IoHome, IoSettingsOutline} from "react-icons/io5";
import {useAuth} from "../../context/AuthContext.tsx";
import {MdOutlineLogout} from "react-icons/md";
import {useAudioContext} from "../../context/AudioContext.tsx";

const routes = [
    {id: 'home', icon: <IoHome className={classes.icon} size={24}/>, link: "/"},
    {id: 'scores', icon: <PiSpeakerSimpleHigh className={classes.icon} size={24}/>, link: "/scores"},
    {id: 'editor', icon: <GiGClef className={classes.icon} size={24}/>, link: "/editor"},
];

const protectedRoutes = [
    {id: 'admin', icon: <IoSettingsOutline className={classes.icon} size={24}/>, link: "/admin"},
];

interface Properties {
    onNavigation: () => void;
}

const Sidebar: React.FC<Properties> = (props) => {

    const [t] = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const auth = useAuth();
    const {stopPlayback} = useAudioContext();

    const handleNavigate = (link: string) => {
        navigate(link);
        props.onNavigation();
        stopPlayback();
    }

    const handleLogout = () => {
        auth.logout().then(() => navigate("/"));
        props.onNavigation();
    }

    return (
        <>
            {routes.map((item, index) => (
                <NavLink
                    mb={4}
                    key={index}
                    active={item.link === "/" && location.pathname === "/" || item.link !== "/" && location.pathname.startsWith(item.link)}
                    className={classes.link}
                    label={t(`sidebar.navigation.${item.id}`)}
                    leftSection={item.icon}
                    onClick={() => handleNavigate(item.link)}
                />
            ))}

            {auth.currentUser?.isAdmin && <>
                <Divider my={"lg"}/>

                {protectedRoutes.map((item, index) => (
                    <NavLink
                        mb={4}
                        key={index}
                        active={item.link === "/" && location.pathname === "/" || item.link !== "/" && location.pathname.startsWith(item.link)}
                        className={classes.link}
                        label={t(`sidebar.navigation.${item.id}`)}
                        leftSection={item.icon}
                        onClick={() => handleNavigate(item.link)}
                    />
                ))}
            </>}

            <Divider mt={"lg"}/>

            {!auth.currentUser && <Group mt={"lg"} justify={"center"}>
                <Link to={"/login"} onClick={props.onNavigation}>
                    <Button size={"sm"} variant={"outline"}>
                        {t("sidebar.login")}
                    </Button>
                </Link>
            </Group>}

            {auth.currentUser &&
                <Group mt={"lg"} justify={"center"}>
                    <Button variant={"subtle"} onClick={handleLogout}>
                        <MdOutlineLogout size={24}/>
                        <Box ml={"xs"}>
                            {t("sidebar.logout")}
                        </Box>
                    </Button>
                </Group>}
        </>
    );
}

export default Sidebar;
