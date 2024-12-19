import React from 'react';
import {Badge, Text} from "@mantine/core";

interface Properties {
    label: string;
}

const ValueIndicator: React.FC<Properties> = (props) => {

    return (
        <Badge
            color={props.label ? "black" : "transparent"}
            variant={"transparent"}
            w={60}
            mt={-5}
            style={{textTransform: "lowercase", justifyItems: "center"}}
        >
            <Text w={75} fw={"bold"} size={"xs"} style={{textAlign: "center"}}>
                {props.label || "-"}
            </Text>
        </Badge>
    )
}


export default ValueIndicator;
