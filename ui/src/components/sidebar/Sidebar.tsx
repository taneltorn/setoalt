import React from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {Box, Button, Code, Divider, Group, NavLink, Title} from "@mantine/core";
import classes from "./Sidebar.module.scss";
import {GiGClef} from "react-icons/gi";
import {PiSpeakerSimpleHigh} from "react-icons/pi";
import {IoHome, IoLogInOutline, IoSettingsOutline} from "react-icons/io5";
import packageInfo from "../../../package.json";
import {useAuth} from "../../context/AuthContext.tsx";
import {MdOutlineLogout} from "react-icons/md";

const routes = [
    {id: 'home', icon: <IoHome className={classes.icon} size={24}/>, link: "/"},
    {id: 'scores', icon: <PiSpeakerSimpleHigh className={classes.icon} size={24}/>, link: "/scores"},
    {id: 'editor', icon: <GiGClef className={classes.icon} size={24}/>, link: "/editor"},
];

const protectedRoutes = [
    {id: 'admin', icon: <IoSettingsOutline className={classes.icon} size={24}/>, link: "/admin"},
];

const Sidebar: React.FC = () => {

    const [t] = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const auth = useAuth();
    // const userService = useUserService();

    const handleLogout = () => {
        auth.logout()
            .then(() => navigate("/"));
    }

    return (
        <>
            <p>{auth.currentUser ? auth.currentUser.username : "Guest"}</p>
            <Group py={"sm"} justify={"space-between"} visibleFrom={"lg"}>
                <Link to={"/"}>
                    <Title order={4}>{t("brand.title")}</Title>
                </Link>
                <Code> {packageInfo.version}</Code>
            </Group>

            <Divider mb={"lg"}/>

            <div className={classes.navbar}>
                {routes.map((item, index) => (
                    <NavLink
                        mb={4}
                        key={index}
                        active={item.link === "/" && location.pathname === "/" || item.link !== "/" && location.pathname.startsWith(item.link)}
                        className={classes.link}
                        label={t(`sidebar.navigation.${item.id}`)}
                        leftSection={item.icon}
                        onClick={() => navigate(item.link)}
                    />
                ))}

                {auth.currentUser && <>

                    <Divider my={"lg"}/>

                    {protectedRoutes.map((item, index) => (
                        <NavLink
                            mb={4}
                            key={index}
                            active={item.link === "/" && location.pathname === "/" || item.link !== "/" && location.pathname.startsWith(item.link)}
                            className={classes.link}
                            label={t(`sidebar.navigation.${item.id}`)}
                            leftSection={item.icon}
                            onClick={() => navigate(item.link)}
                        />
                    ))}
                </>}

                <Divider mt={"lg"}/>

                {!auth.currentUser && <>
                    <Group mt={"lg"} justify={"center"} hiddenFrom={"lg"}>
                        <Link to={"/login"}>
                            <IoLogInOutline className={classes.icon} size={24}/>
                        </Link>
                    </Group>
                    <Group mt={"lg"} justify={"center"} visibleFrom={"lg"}>
                        <Link to={"/login"}>
                            <Button size={"sm"} variant={"outline"}>
                                {t("sidebar.login")}
                            </Button>
                        </Link>
                    </Group>
                </>}

                {auth.currentUser && <>
                    <Group mt={"lg"} justify={"center"} hiddenFrom={"lg"}>
                        <Box onClick={handleLogout}>
                            <MdOutlineLogout size={24} className={classes.icon}  />
                        </Box>
                    </Group>

                    <Group mt={"lg"} justify={"center"} visibleFrom={"lg"}>
                        <Button variant={"subtle"} onClick={handleLogout}>
                            <MdOutlineLogout size={24}/>
                            <Box ml={"xs"}>
                                {t("sidebar.logout")}
                            </Box>
                        </Button>
                    </Group>
                </>}
            </div>
        </>
    );
}

export default Sidebar;
