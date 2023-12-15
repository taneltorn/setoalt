import React from "react";
import {useTranslation} from "react-i18next";
import {Avatar, Code, Group, Title} from "@mantine/core";
import packageInfo from "../../../package.json";
import {Link} from "react-router-dom";

const Logo: React.FC = () => {

    const [t] = useTranslation();

    return (
        <Group py={"sm"} justify={"space-between"}>
            <Group>
                <Link to={"/"}>
                    <Avatar
                        src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThX-BQfPlu6Rk0vmDvryLsnQQ9LbjrwfjKLCWj22soKQ&s"}
                    />
                </Link>
                <Title order={4}>{t("brand.title")}</Title>
            </Group>
            <Code> {packageInfo.version}</Code>
        </Group>
    );
}

export default Logo;
