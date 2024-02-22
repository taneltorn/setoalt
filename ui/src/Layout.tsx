import React from 'react';
import {Outlet} from "react-router-dom";
import {Alert, AppShell, Text} from "@mantine/core";
import Sidebar from "./components/sidebar/Sidebar.tsx";

const Layout: React.FC = () => {

    return (
        <AppShell
            px={"xl"}
            py={"sm"}
            layout={"default"}
            navbar={{width: {base: 75, lg: 250}, breakpoint: 'base'}}>
            <AppShell.Navbar px={"sm"}>
                <Sidebar/>
            </AppShell.Navbar>
            <AppShell.Main id={"content"}>
                {import.meta.env.VITE_ENVIRONMENT === "dev" &&
                    <Alert mb={"md"}>
                        <Text mr={"md"} fw={"bold"}>
                            See on rakenduse arendusversioon!
                        </Text>
                        Kasuta rakenduse test versiooni, mis asub aadressil:
                        <a href={"http://157.230.76.45"}>http://157.230.76.45</a>
                    </Alert>}
                <Outlet/>
            </AppShell.Main>
        </AppShell>
    );
}

export default Layout;
