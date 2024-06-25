import React from 'react';
import {Box, Text} from "@mantine/core";
import {Size} from "../utils/constants.ts";

interface Properties {
    onClick?: () => void;
}

const Logo: React.FC<Properties> = (props) => {

    return (
        <Box display={"flex"} onClick={props.onClick}>
            <Text c={"red"} fw={"bold"} fz={18} ff={"Roboto"}>Seto</Text>
            <Text c={"black"} fz={Size.icon.SM} fw={"bold"} ff={"Roboto"}>alt.</Text>
        </Box>
    );
}

export default Logo;
