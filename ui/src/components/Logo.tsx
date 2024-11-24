import React from 'react';
import {Box, Code, Group, Text} from "@mantine/core";
import packageInfo from "../../package.json";

interface Properties {
    onClick?: () => void;
}

const Logo: React.FC<Properties> = (props) => {

    return (
        <Box onClick={props.onClick}>
            <Group gap={0}>
                <Text c={"red"} fz={24} ff={"Roboto"}>seto</Text>
                <Text c={"black"} fz={24} fw={"bold"} ff={"Roboto"}>noot</Text>
            </Group>
           
            <Group mt={-10}>
                <Code color={"transparent"}>{packageInfo.version}</Code>
            </Group>
        </Box>);
}

export default Logo;
