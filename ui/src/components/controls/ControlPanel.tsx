import React, {ReactNode} from "react";
import {Grid, Group} from "@mantine/core";

interface Properties {
    leftSection?: ReactNode;
    rightSection?: ReactNode;
}
const ControlPanel: React.FC<Properties> = (props) => {

    return (
        <Grid my={"md"}>
            <Grid.Col span={6}>
                {props.leftSection}
            </Grid.Col>
            <Grid.Col span={6}>
                <Group justify={"end"}>
                    {props.rightSection}
                </Group>
            </Grid.Col>
        </Grid>
    )
}

export default ControlPanel;
