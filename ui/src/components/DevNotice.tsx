import React from 'react';
import {Link, useLocation} from "react-router-dom";
import {
    Button,
    Group,
    Switch,
    Text,
} from "@mantine/core";
import {FaGitAlt} from "react-icons/fa";
import {Size} from "../utils/constants.ts";
import {useAuth} from "../hooks/useAuth.tsx";
import {useDevMode} from "../hooks/useDevContext.tsx";
import {useTranslation} from "react-i18next";
import Help from "./Help.tsx";

interface Properties {
    onNavigate: () => void;
}

const DevNotice: React.FC<Properties> = ({onNavigate}) => {

    const {t} = useTranslation();
    const auth = useAuth();
    const location = useLocation();
    const {isDevMode, setIsDevMode} = useDevMode();

    return (
        <>
            <Group p={"md"} mt={"xl"}>
                <Group gap={"xs"}>
                    {/*<FaInfoCircle color={theme.colors.blue[9]} size={Size.icon.MD}/>*/}
                    <Help tab={location.pathname.includes("edit") ? "editor" : "playback"}/>
                </Group>

                <Text size={"md"}>
                    {t("page.sidebar.notice.message")}
                </Text>

                <Link to={"/changelog"}>
                    <Button onClick={onNavigate} color={"blue"} variant={"outline"}
                            leftSection={<FaGitAlt size={Size.icon.SM}/>}>
                        {t("page.sidebar.notice.changelog")}
                    </Button>
                </Link>
            </Group>
            {auth.currentUser?.isAdmin &&
                <Group px={"md"}>
                    <Switch
                        mt={"sm"}
                        checked={isDevMode}
                        label={"Dev mode"}
                        onChange={() => setIsDevMode(!isDevMode)}
                    />
                </Group>}
        </>);
}

export default DevNotice;
