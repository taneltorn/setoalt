import React from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {Box, Button, Divider, Group, NavLink} from "@mantine/core";
import classes from "./Sidebar.module.scss";
import {PiSpeakerSimpleHigh} from "react-icons/pi";
import {IoSettingsOutline} from "react-icons/io5";
import {useAuth} from "../../hooks/useAuth.tsx";
import {MdOutlineLogout} from "react-icons/md";
import {useAudioContext} from "../../hooks/useAudioContext.tsx";
import {BsMusicNoteList} from "react-icons/bs";
import {Size} from "../../utils/constants.ts";
import Logo from "../Logo.tsx";
import {DialogType} from "../../utils/enums.ts";
import {useDialogContext} from "../../hooks/useDialogContext.tsx";
import {usePagination} from "../../hooks/usePagination.tsx";
import {LuClipboardList} from "react-icons/lu";

const routes = [
    {id: 'scores', icon: <PiSpeakerSimpleHigh className={classes.icon} size={Size.icon.SM}/>, link: "/scores"},
    {id: 'editor', icon: <BsMusicNoteList className={classes.icon} size={Size.icon.SM}/>, link: "/editor"},
    {id: 'about', icon: <LuClipboardList className={classes.icon} size={Size.icon.SM}/>, link: "/about"},

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
    const {open} = useDialogContext();
    const {setPage} = usePagination();

    const handleNavigate = (link: string) => {
        navigate(link);
        props.onNavigate();
        stopPlayback();
        setPage(1);
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
                <Button size={"sm"} variant={"outline"} onClick={() => open(DialogType.LOGIN)}>
                    {t("page.sidebar.navigation.login")}
                </Button>
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
