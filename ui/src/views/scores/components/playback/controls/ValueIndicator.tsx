import React from 'react';
import {Text} from "@mantine/core";

interface Properties {
    visible?: boolean;
    label: string;
}

const ValueIndicator: React.FC<Properties> = (props) => {


    return (
        <>
            {props.visible &&
                <Text
                    w={40}
                    size={"xs"}
                    style={{position: "absolute", top: 40, left: 5}}
                >
                    {props.label}
                </Text>}
        </>
    )
}


export default ValueIndicator;
