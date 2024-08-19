import React from 'react';
import {Link} from "react-router-dom";
import {
    Button,
    Group,
    Switch,
    Text, useMantineTheme,
} from "@mantine/core";
import {FaGitAlt} from "react-icons/fa";
import {Size} from "../utils/constants.ts";
import {useAuth} from "../hooks/useAuth.tsx";
import {useDevMode} from "../hooks/useDevContext.tsx";
import {useTranslation} from "react-i18next";
import {FaCircleInfo} from "react-icons/fa6";

interface Properties {
    onNavigate: () => void;
}

const DevNotice: React.FC<Properties> = ({onNavigate}) => {

    const {t} = useTranslation();
    const auth = useAuth();
    const theme = useMantineTheme();
    const {isDevMode, setIsDevMode} = useDevMode();

    return (
        <>
            <Group p={"md"} mt={"xl"}>
                <FaCircleInfo size={Size.icon.MD} color={theme.colors.blue[9]}/>
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
