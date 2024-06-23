import React from 'react';
import {Link, Outlet} from "react-router-dom";
import {Alert, AppShell, Box, Burger, Code, Group, Switch, Text} from "@mantine/core";
import Sidebar from "./components/sidebar/Sidebar.tsx";
import {useDisclosure} from "@mantine/hooks";
import packageInfo from "../package.json";
import {useAuth} from "./context/AuthContext.tsx";
import {useTranslation} from "react-i18next";
import {IoAlertCircleOutline} from "react-icons/io5";
import Logo from "./components/Logo.tsx";
import {UserIcons} from "./utils/icons.tsx";
import {useDevMode} from "./context/DevModeContext.tsx";

const Layout: React.FC = () => {

    const {t} = useTranslation();
    const [opened, {toggle, close}] = useDisclosure();
    const auth = useAuth();
    const {isDevMode, setIsDevMode} = useDevMode();

    return (
        <AppShell
            py={"md"}
            px={"xl"}
            layout={"default"}
            header={{height: {base: 65}}}
            navbar={{
                width: {base: 220},
                breakpoint: 'md',
                collapsed: {mobile: !opened},
            }}
        >
            <AppShell.Header>
                <Box p={"md"}>
                    <Group justify={"space-between"}>
                        <Burger
                            opened={opened}
                            onClick={toggle}
                            hiddenFrom="md"
                            size="md"
                        />
                        <Group visibleFrom={"md"}>
                            <Link to={"/"}>
                                <Logo/>
                            </Link>

                            <Code> {packageInfo.version}</Code>

                            {import.meta.env.VITE_ENVIRONMENT === "dev"
                                ?
                                <Alert py={4} icon={<IoAlertCircleOutline size={24}/>}>
                                    <Group justify={"start"}>
                                        Kasuta rakenduse versiooni, mis asub aadressil:
                                        <Link target={"_blank"}
                                              to={"http://157.230.76.45"}>http://157.230.76.45 </Link>
                                    </Group>
                                </Alert>
                                :
                                <Alert py={4} color={"blue"} icon={<IoAlertCircleOutline size={24}/>}>
                                    Tegemist on arendusjärgus oleva rakendusega.
                                </Alert>}

                            {auth.currentUser?.isAdmin &&
                                <Switch
                                    className={"hover-pointer"}
                                    checked={isDevMode}
                                    label={"Dev mode"}
                                    onChange={() => setIsDevMode(!isDevMode)}
                                />}
                        </Group>
                        <Group justify={"end"}>
                            {UserIcons.get(auth.currentUser?.role || "guest")}
                            <Text>
                                {auth.currentUser?.firstname || auth.currentUser?.username || t("role.guest")}
                            </Text>
                        </Group>
                    </Group>
                </Box>
            </AppShell.Header>

            <AppShell.Navbar p={"md"}>
                <Sidebar onNavigation={close}/>
            </AppShell.Navbar>

            <AppShell.Main id={"content"}>
                <Outlet/>
            </AppShell.Main>
        </AppShell>
    );
}

export default Layout;
