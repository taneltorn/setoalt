import React from 'react';
import {Box, Code, Group, Text} from "@mantine/core";
import packageInfo from "../../package.json";

interface Properties {
    onClick?: () => void;
}

const Logo: React.FC<Properties> = (props) => {

    return (
        <Box onClick={props.onClick}>
            <Text c={"red"} fz={24} ff={"Roboto"}>
                Seto<strong style={{color: "black"}}>alt</strong>
            </Text>
            <Group mt={-10}>
                <Code color={"transparent"}>{packageInfo.version}</Code>
            </Group>
        </Box>);
}

export default Logo;
