import {Alert, Text} from "@mantine/core";
import {IoIosWarning} from "react-icons/io";
import React from "react";

const DevMessage: React.FC = () => {

    return (
        <Alert mb={"md"} icon={<IoIosWarning size={40   }/>}>
            <Text fw={500}>Tegemist on arendusjärgus oleva veebirakendusega. Kõik, mida näed, võib muutuda.</Text>
        </Alert>
    );
}

export default DevMessage;
