import React from "react";
import {useTranslation} from "react-i18next";
import {Avatar, Code, Divider, Group, Title} from "@mantine/core";
import Navbar from "./Navbar.tsx";
import packageInfo from "../../../package.json";
import classes from "./SideBar.module.scss";
import {Link} from "react-router-dom";

const SideBar: React.FC = () => {

    const [t] = useTranslation();

    return (
        <aside className={classes.sidebar}>
            <Group py={"sm"} justify={"space-between"}>
                <Group>
                    <Link to={"/"}>
                        <Avatar
                            src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThX-BQfPlu6Rk0vmDvryLsnQQ9LbjrwfjKLCWj22soKQ&s"}
                        />
                    </Link>
                    <Title order={4}>{t("title")}</Title>
                </Group>
                <Code> {packageInfo.version}</Code>
            </Group>
            <Divider mb={"lg"}/>
            <Navbar/>
        </aside>
    );
}

export default SideBar;
