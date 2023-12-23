import React from 'react';
import {Outlet} from "react-router-dom";
import {AppShell, Divider} from "@mantine/core";
import Navbar from "./components/sidebar/Navbar.tsx";
import Logo from "./components/sidebar/Logo.tsx";
import DevMessage from "./components/DevMessage.tsx";

const Layout: React.FC = () => {

    return (
        <AppShell
            px={"md"}
            py={"sm"}
            layout={"alt"}
            navbar={{width: {base: 75, lg: 300}, breakpoint: 'base'}}>
            <AppShell.Navbar px={"sm"}>
                <Logo/>
                <Divider mb={"lg"}/>
                <Navbar/>
            </AppShell.Navbar>
            <AppShell.Main id={"content"}>
                <DevMessage/>
                <Outlet/>
            </AppShell.Main>
        </AppShell>
    );
}

export default Layout;
