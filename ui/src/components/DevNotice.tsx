import React from 'react';
import {Link} from "react-router-dom";
import {
    Button,
    Group,
    Switch,
    Text,
    useMantineTheme
} from "@mantine/core";
import {FaGitAlt, FaInfoCircle} from "react-icons/fa";
import {Size} from "../utils/constants.ts";
import {useAuth} from "../context/AuthContext.tsx";
import {useDevMode} from "../context/DevModeContext.tsx";
import {useTranslation} from "react-i18next";

interface Properties {
    onNavigate: () => void;
}

const DevNotice: React.FC<Properties> = ({onNavigate}) => {

    const {t} = useTranslation();
    const theme = useMantineTheme();
    const auth = useAuth();
    const {isDevMode, setIsDevMode} = useDevMode();


    return (
        <>
            <Group p={"md"}>
                <FaInfoCircle color={theme.colors.blue[9]} size={Size.icon.MD}/>
                <Text size={"md"}>Tegemist on arendusjärgus oleva rakendusega!</Text>

                <Link to={"/changelog"}>
                    <Button onClick={onNavigate} color={"blue"} variant={"outline"}
                            leftSection={<FaGitAlt size={Size.icon.SM}/>}>
                        {t("button.changelog")}
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
