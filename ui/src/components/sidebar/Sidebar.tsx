import React from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {Badge, Box, Button, Code, Divider, Group, NavLink, Text} from "@mantine/core";
import classes from "./Sidebar.module.scss";
import {GiGClef} from "react-icons/gi";
import {PiSpeakerSimpleHigh} from "react-icons/pi";
import {IoHome, IoLogInOutline, IoSettingsOutline} from "react-icons/io5";
import packageInfo from "../../../package.json";
import {Role, useAuth} from "../../context/AuthContext.tsx";
import {MdOutlineLogout} from "react-icons/md";
import {FaUser, FaUserGraduate} from "react-icons/fa";
import DevPanel from "./DevPanel.tsx";
import {RiAdminFill} from "react-icons/ri";
import {CiUser} from "react-icons/ci";

const routes = [
    {id: 'home', icon: <IoHome className={classes.icon} size={24}/>, link: "/"},
    {id: 'scores', icon: <PiSpeakerSimpleHigh className={classes.icon} size={24}/>, link: "/scores"},
    {id: 'editor', icon: <GiGClef className={classes.icon} size={24}/>, link: "/editor"},
];

const protectedRoutes = [
    {id: 'admin', icon: <IoSettingsOutline className={classes.icon} size={24}/>, link: "/admin"},
];

export const UserIcons = new Map([
    [Role.ADMIN, <RiAdminFill size={24}/>],
    [Role.EDITOR, <FaUserGraduate size={24}/>],
    [Role.USER, <FaUser size={24}/>],
    ["guest", <CiUser size={24}/>]
]);

const Sidebar: React.FC = () => {

    const [t] = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const auth = useAuth();

    const handleLogout = () => {
        auth.logout().then(() => navigate("/"));
    }

    return (
        <>
            <Group py={"sm"} justify={"space-between"} visibleFrom={"lg"}>
                <Group>
                    {UserIcons.get(auth.currentUser?.role || "guest")}
                    <Text>
                        {auth.currentUser?.firstname || auth.currentUser?.username || t("role.guest")}
                    </Text>
                </Group>
                <Code> {packageInfo.version}</Code>
            </Group>


            <Badge mb={"md"} bg="gray.5" style={{width: "100%"}}>
                {import.meta.env.VITE_ENVIRONMENT?.toUpperCase() || "undefined"}
            </Badge>

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
                            <MdOutlineLogout size={24} className={classes.icon}/>
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

                <Box mt={"xl"}>
                    <DevPanel/>
                </Box>
            </div>
        </>
    );
}

export default Sidebar;
