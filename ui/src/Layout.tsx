import React, {useMemo} from 'react';
import {Link, Outlet} from "react-router-dom";
import {
    Affix,
    AppShell,
    Box,
    Burger,
    Button,
    Divider,
    Group, ScrollArea,
    Transition
} from "@mantine/core";
import Navigation from "./components/sidebar/Navigation.tsx";
import {useDisclosure, useWindowScroll} from "@mantine/hooks";
import Logo from "./components/Logo.tsx";
import {Size} from "./utils/constants.ts";
import {IoMdArrowUp} from "react-icons/io";
import {useTranslation} from "react-i18next";
import {Notifications} from "@mantine/notifications";
import {useDialogContext} from "./context/DialogContext.tsx";
import ProfileLink from "./components/ProfileLink.tsx";
import DevNotice from "./components/DevNotice.tsx";

const Layout: React.FC = () => {

    const {t} = useTranslation();
    const [opened, {toggle, close}] = useDisclosure();
    const [scroll, scrollTo] = useWindowScroll();
    const {active} = useDialogContext();

    const isAtBottom = useMemo(() => {
        const scrolledTo = window.scrollY + window.innerHeight;
        const threshold = 50;
        return document.body.scrollHeight - threshold <= scrolledTo;
    }, [window.scrollY]);

    return (
        <AppShell
            py={"md"}
            px={{base: "sm", md: "lg"}}
            layout={"default"}
            header={{height: {base: 48, md: 1}}}
            navbar={{
                width: {base: 240},
                breakpoint: 'md',
                collapsed: {mobile: !opened},
            }}
        >
            <Notifications position="top-right"/>

            <AppShell.Header px={"md"} py={{base: 4, md: 0}}>
                <Group justify={"space-between"}>
                    <Burger
                        opened={opened}
                        onClick={toggle}
                        hiddenFrom="md"
                        size="md"
                    />
                    <ProfileLink/>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar p={"md"}>
                <ScrollArea>
                    <Box visibleFrom={"md"}>
                        <Group justify={"space-between"}>
                            <Link to={"/"} onClick={close}>
                                <Logo/>
                            </Link>
                            <ProfileLink/>
                        </Group>
                        <Divider my={"md"}/>
                    </Box>

                    <Navigation onNavigate={close}/>
                    <Divider mt={"xl"}/>
                    <DevNotice onNavigate={close}/>
                </ScrollArea>
            </AppShell.Navbar>

            <AppShell.Main id={"content"} pb={50}>
                <Outlet/>

                {!opened && isAtBottom && !active &&
                    <Affix position={{bottom: 20, right: 20}}>
                        <Transition transition="slide-up" mounted={scroll.y > 0}>
                            {(transitionStyles) => (
                                <Button
                                    size={"xs"}
                                    leftSection={<IoMdArrowUp size={Size.icon.XS}/>}
                                    style={transitionStyles}
                                    onClick={() => scrollTo({y: 0})}
                                >
                                    {t("button.backToTop")}
                                </Button>
                            )}
                        </Transition>
                    </Affix>}
            </AppShell.Main>
        </AppShell>
    );
}

export default Layout;
