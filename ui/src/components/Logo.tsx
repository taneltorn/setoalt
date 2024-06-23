import React from 'react';
import {Box, Text} from "@mantine/core";

const Logo: React.FC = () => {

    return (
        <Box display={"flex"}>
            <Text fz={18} ff={"Roboto"}>Seto</Text>
            <Text fz={24} fw={"bold"} ff={"Roboto"}>alt.</Text>
        </Box>
    );
}

export default Logo;
