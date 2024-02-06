import React from 'react';
import {Outlet} from "react-router-dom";
import {AppShell} from "@mantine/core";
import Sidebar from "./components/sidebar/Sidebar.tsx";
import DevMessage from "./components/DevMessage.tsx";

const Layout: React.FC = () => {

    return (
        <AppShell
            px={"md"}
            py={"sm"}
            layout={"default"}
            navbar={{width: {base: 75, lg: 250}, breakpoint: 'base'}}>
            <AppShell.Navbar px={"sm"}>
                <Sidebar/>
            </AppShell.Navbar>
            <AppShell.Main id={"content"}>
                <DevMessage/>
                <Outlet/>
            </AppShell.Main>
        </AppShell>
    );
}

export default Layout;
