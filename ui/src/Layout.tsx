import React from 'react';
import {Link, Outlet} from "react-router-dom";
import {Alert, Anchor, AppShell, Burger, Code, Group, Switch, Text} from "@mantine/core";
import Sidebar, {UserIcons} from "./components/sidebar/Sidebar.tsx";
import {useDisclosure} from "@mantine/hooks";
import packageInfo from "../package.json";
import {useAuth} from "./context/AuthContext.tsx";
import {useTranslation} from "react-i18next";
import {useDevMode} from "./context/DevModeContext.tsx";
import {FaReact} from "react-icons/fa";
import {IoAlertCircleOutline} from "react-icons/io5";

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
                <Group justify={"space-between"} p={"md"}>
                    <Burger
                        opened={opened}
                        onClick={toggle}
                        hiddenFrom="md"
                        size="md"
                    />
                    <Group visibleFrom={"md"}>
                        <Link to={"/"}>
                            <FaReact size={32}/>
                        </Link>

                        <Code> {packageInfo.version}</Code>
                        {auth.currentUser?.isAdmin &&
                            <Switch
                                className={"hover-pointer"}
                                checked={isDevMode}
                                label={"Dev mode"}
                                onChange={() => setIsDevMode(!isDevMode)}
                            />}
                    </Group>

                    <Group>
                        <Alert color={"red"} py={4} icon={<IoAlertCircleOutline size={24}/>}>
                            Tegemist on arendusjärgus oleva veebirakendusega.
                        </Alert>

                        {UserIcons.get(auth.currentUser?.role || "guest")}
                        <Text>
                            {auth.currentUser?.firstname || auth.currentUser?.username || t("role.guest")}
                        </Text>
                    </Group>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar p={"md"}>
                <Sidebar onNavigation={close}/>
            </AppShell.Navbar>

            <AppShell.Main id={"content"}>
                {import.meta.env.VITE_ENVIRONMENT === "dev" &&
                    <Alert mb={"md"}>
                        <Text fw={"bold"}>
                            See on rakenduse arendusversioon!
                        </Text>
                        Kasuta rakenduse versiooni, mis asub aadressil:
                        <Anchor
                            fw={"bold"}
                            ml={6}
                            fz={"sm"}
                            target={"_blank"}
                            href={"http://157.230.76.45"}
                        >
                            http://157.230.76.45
                        </Anchor>
                    </Alert>}
                <Outlet/>
            </AppShell.Main>
        </AppShell>
    );
}

export default Layout;
