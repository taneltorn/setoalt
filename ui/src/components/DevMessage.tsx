import {Alert, Group, Switch, Text} from "@mantine/core";
import {IoIosWarning} from "react-icons/io";
import React from "react";
import {useDevMode} from "../context/DevModeContext.tsx";

const DevMessage: React.FC = () => {

    const {isDevMode, setIsDevMode} = useDevMode();

    return (
        <Alert mb={"md"} icon={<IoIosWarning size={40   }/>}>
            <Group justify={"space-between"}>
            <Text fw={500}>Tegemist on arendusjärgus oleva veebirakendusega. Kõik, mida näed, võib muutuda.</Text>


                    <Switch
                        className={"hover-pointer"}
                        checked={isDevMode}
                        label={"Dev mode"}
                        labelPosition={"left"}
                        onChange={() => setIsDevMode(!isDevMode)}
                    />
            </Group>
        </Alert>
    );
}

export default DevMessage;
