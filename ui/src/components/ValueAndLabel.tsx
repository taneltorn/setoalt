import React from 'react';
import {Box, Text, useMantineTheme} from "@mantine/core";

interface Properties {
    label: string;
    value?: string;
}


const ValueAndLabel: React.FC<Properties> = (props) => {

    const theme = useMantineTheme();
    return (
        <Box mb={"md"}>
            <Text fz={"sm"} c={theme.colors.gray[7]}>{props.label}</Text>
            <Text fz={"lg"} fw={"bold"}>{props.value}</Text>
        </Box>
    );
}

export default ValueAndLabel;
