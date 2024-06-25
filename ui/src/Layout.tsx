import React from 'react';
import {Link, Outlet} from "react-router-dom";
import {
    Affix,
    AppShell,
    Burger,
    Button,
    Code,
    Divider,
    Group,
    Switch,
    Text,
    Transition,
    useMantineTheme
} from "@mantine/core";
import Navigation from "./components/sidebar/Navigation.tsx";
import {useDisclosure, useWindowScroll} from "@mantine/hooks";
import packageInfo from "../package.json";
import Logo from "./components/Logo.tsx";
import {FaGitAlt, FaInfoCircle} from "react-icons/fa";
import {Size} from "./utils/constants.ts";
import {useAuth} from "./context/AuthContext.tsx";
import {useDevMode} from "./context/DevModeContext.tsx";
import {IoMdArrowUp} from "react-icons/io";
import {useTranslation} from "react-i18next";
import {Notifications} from "@mantine/notifications";

const Layout: React.FC = () => {

    const {t} = useTranslation();
    const theme = useMantineTheme();
    const [opened, {toggle, close}] = useDisclosure();
    const auth = useAuth();
    const {isDevMode, setIsDevMode} = useDevMode();
    const [scroll, scrollTo] = useWindowScroll();

    return (
        <AppShell
            py={"md"}
            px={"xl"}
            layout={"default"}
            navbar={{
                width: {base: 240},
                breakpoint: 'md',
                collapsed: {mobile: !opened},
            }}
        >
            <Notifications position="top-right" />

            <AppShell.Navbar p={"md"}>
                <Group justify={"space-between"} mb={"lg"}>
                    <Link to={"/"} onClick={close}>
                        <Logo/>
                    </Link>
                    <Code>{packageInfo.version}</Code>
                </Group>

                <Navigation onNavigate={close}/>
                <Divider mt={"xl"}/>

                <Group p={"md"}>
                    <FaInfoCircle color={theme.colors.blue[9]} size={Size.icon.MD}/>
                    <Text size={"md"}>Tegemist on arendusjärgus oleva rakendusega!</Text>

                    <Link to={"/changelog"}>
                        <Button color={"blue"} variant={"outline"} leftSection={<FaGitAlt size={Size.icon.SM}/>}>
                            Muutelugu
                        </Button>
                    </Link>

                    {auth.currentUser?.isAdmin &&
                        <Switch
                            mt={"sm"}
                            checked={isDevMode}
                            label={"Dev mode"}
                            onChange={() => setIsDevMode(!isDevMode)}
                        />}
                </Group>
            </AppShell.Navbar>

            <AppShell.Main id={"content"} pb={"xl"}>
                <Burger
                    opened={opened}
                    onClick={toggle}
                    hiddenFrom="md"
                    size="md"
                />
                <Outlet/>

                <Affix position={{ bottom: 20, right: 20 }}>
                    <Transition transition="slide-up" mounted={scroll.y > 0}>
                        {(transitionStyles) => (
                            <Button
                                size={"xs"}
                                leftSection={<IoMdArrowUp size={Size.icon.XS}/>}
                                style={transitionStyles}
                                onClick={() => scrollTo({ y: 0 })}
                            >
                                {t("button.backToTop")}
                            </Button>
                        )}
                    </Transition>
                </Affix>
            </AppShell.Main>
        </AppShell>
    );
}

export default Layout;
