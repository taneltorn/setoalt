import React from 'react';
import {Badge} from "@mantine/core";

interface Properties {
    label: string;
}

const ValueIndicator: React.FC<Properties> = (props) => {

    return (
        <Badge
            color={props.label ? "black" : "transparent"}
            variant={"transparent"}
            w={75}
            style={{position: "relative", top: -10 , textTransform: "lowercase"}}>
            {props.label || "-"}
        </Badge>
    )
}


export default ValueIndicator;
