import React, {ReactNode} from "react";
import {Group} from "@mantine/core";

interface Properties {
    leftSection?: ReactNode;
    rightSection?: ReactNode;
}

const ControlPanel: React.FC<Properties> = (props) => {

    return (
        <Group my={"md"} justify={"space-between"}>
            {props.leftSection}
            {props.rightSection}
        </Group>
    )
}

export default ControlPanel;
