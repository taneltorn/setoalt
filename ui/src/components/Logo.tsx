import React from 'react';
import {Box, Group, Image} from "@mantine/core";

interface Properties {
    onClick?: () => void;
}

const Logo: React.FC<Properties> = (props) => {

    return (
        <Box onClick={props.onClick}>
            <Group gap={"md"} wrap={"nowrap"}>
                <Image src={"/logo.png"} alt={"Punktinoot Logo"} width={60} height={60}/>
            </Group>
        </Box>);
}

export default Logo;
