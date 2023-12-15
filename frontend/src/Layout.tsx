import React from 'react';
import { Outlet } from "react-router-dom";
import {AppShell,  Divider} from "@mantine/core";
import Navbar from "./components/sidebar/Navbar.tsx";
import Logo from "./components/sidebar/Logo.tsx";

const Layout: React.FC = () => {

    return (
        <AppShell
            px={"md"}
            py={"sm"}
            layout={"alt"}
            navbar={{
                width: 300,
                breakpoint: 'xs',

            }}>
            <AppShell.Navbar px={"sm"}>
                <Logo />
                <Divider mb={"lg"}/>
                <Navbar/>
            </AppShell.Navbar>
            <AppShell.Main id={"content"}>
                <Outlet/>
            </AppShell.Main>
        </AppShell>
    );
}

export default Layout;
