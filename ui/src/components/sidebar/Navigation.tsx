import React from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {Box, Button, Divider, Group, NavLink} from "@mantine/core";
import classes from "./Sidebar.module.scss";
import {PiSpeakerSimpleHigh} from "react-icons/pi";
import {IoHome, IoSettingsOutline} from "react-icons/io5";
import {useAuth} from "../../context/AuthContext.tsx";
import {MdOutlineLogout} from "react-icons/md";
import {useAudioContext} from "../../context/AudioContext.tsx";
import {BsMusicNoteList} from "react-icons/bs";
import {Size} from "../../utils/constants.ts";
import Logo from "../Logo.tsx";

const routes = [
    {id: 'home', icon: <IoHome className={classes.icon} size={Size.icon.SM}/>, link: "/"},
    {id: 'scores', icon: <PiSpeakerSimpleHigh className={classes.icon} size={Size.icon.SM}/>, link: "/scores"},
    {id: 'editor', icon: <BsMusicNoteList className={classes.icon} size={Size.icon.SM}/>, link: "/editor"},
];

const protectedRoutes = [
    {id: 'admin', icon: <IoSettingsOutline className={classes.icon} size={Size.icon.SM}/>, link: "/admin"},
];

interface Properties {
    onNavigate: () => void;
}

const Navigation: React.FC<Properties> = (props) => {

    const [t] = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const auth = useAuth();
    const {stopPlayback} = useAudioContext();

    const handleNavigate = (link: string) => {
        navigate(link);
        props.onNavigate();
        stopPlayback();
    }

    const handleLogout = () => {
        auth.logout().then(() => navigate("/"));
        props.onNavigate();
    }

    return (
        <>
            <Group hiddenFrom={"md"} mb={"md"}>
                <Link to={"/"} onClick={props.onNavigate}>
                    <Logo/>
                </Link>
            </Group>

            {routes.map((item, index) => (
                <NavLink
                    mb={4}
                    key={index}
                    active={item.link === "/" && location.pathname === "/" || item.link !== "/" && location.pathname.startsWith(item.link)}
                    className={classes.link}
                    label={t(`page.sidebar.navigation.${item.id}`)}
                    leftSection={item.icon}
                    onClick={() => handleNavigate(item.link)}
                />
            ))}

            {auth.currentUser?.isAdmin && <>
                <Divider my={"xs"} color={"white"}/>

                {protectedRoutes.map((item, index) => (
                    <NavLink
                        mb={4}
                        key={index}
                        active={item.link === "/" && location.pathname === "/" || item.link !== "/" && location.pathname.startsWith(item.link)}
                        className={classes.link}
                        label={t(`page.sidebar.navigation.${item.id}`)}
                        leftSection={item.icon}
                        onClick={() => handleNavigate(item.link)}
                    />
                ))}
            </>}

            <Divider mt={"xs"}/>

            {!auth.currentUser && <Group mt={"lg"} justify={"center"}>
                <Link to={"/login"} onClick={props.onNavigate}>
                    <Button size={"sm"} variant={"outline"}>
                        {t("page.sidebar.navigation.login")}
                    </Button>
                </Link>
            </Group>}

            {auth.currentUser &&
                <Group mt={"lg"} justify={"center"}>
                    <Button variant={"subtle"} onClick={handleLogout}>
                        <MdOutlineLogout size={Size.icon.SM}/>
                        <Box ml={"xs"}>
                            {t("page.sidebar.navigation.logout")}
                        </Box>
                    </Button>
                </Group>}
        </>
    );
}

export default Navigation;
