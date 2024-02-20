import {Alert, Box, Switch, Text} from "@mantine/core";
import {IoIosWarning} from "react-icons/io";
import React from "react";
import {useDevMode} from "../context/DevModeContext.tsx";
import {useAuth} from "../context/AuthContext.tsx";

const DevPanel: React.FC = () => {

    const {currentUser} = useAuth();
    const {isDevMode, setIsDevMode, useHollowNotes, setUseHollowNotes} = useDevMode();

    return (
        <Alert mb={"md"} color={"red"} icon={<IoIosWarning size={40}/>}>
            <Text variant={"light"} fw={500}>
                Tegemist on arendusjärgus oleva veebirakendusega. Kõik, mida näed, võib muutuda.
            </Text>


            {currentUser?.isAdmin && <Switch
                mt={"lg"}
                className={"hover-pointer"}
                checked={isDevMode}
                label={"Dev mode"}
                onChange={() => setIsDevMode(!isDevMode)}
            />}

            <Switch
                mt={"lg"}
                className={"hover-pointer"}
                checked={useHollowNotes}
                label={"Alt. noodid"}
                onChange={() => setUseHollowNotes(!useHollowNotes)}
            />

            {isDevMode && <Box mt={"xl"}>
                VITE_API_URL: {import.meta.env.VITE_API_URL}
            </Box>}
        </Alert>
    );
}

export default DevPanel;
