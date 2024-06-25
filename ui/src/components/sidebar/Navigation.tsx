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
                <Divider my={"xs"}/>

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

            <Divider mt={"xs"}/>

            {!auth.currentUser && <Group mt={"lg"} justify={"center"}>
                <Link to={"/login"} onClick={props.onNavigate}>
                    <Button size={"sm"} variant={"outline"}>
                        {t("sidebar.login")}
                    </Button>
                </Link>
            </Group>}

            {auth.currentUser &&
                <Group mt={"lg"} justify={"center"}>
                    <Button variant={"subtle"} onClick={handleLogout}>
                        <MdOutlineLogout size={Size.icon.SM}/>
                        <Box ml={"xs"}>
                            {t("sidebar.logout")}
                        </Box>
                    </Button>
                </Group>}
        </>
    );
}

export default Navigation;
