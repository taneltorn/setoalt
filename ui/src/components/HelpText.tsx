import React, {ReactNode} from "react";
import {Grid, Kbd} from "@mantine/core";

interface Properties {
    icon: ReactNode;
    shortKey?: ReactNode | string;
    children: ReactNode;
}

const HelpText: React.FC<Properties> = (props) => {

    return (
        <Grid>
            <Grid.Col span={2} pt={"sm"}>
                {props.icon}
            </Grid.Col>
            <Grid.Col span={10}>
                {props.children}
                {props.shortKey && <>
                    {` Kiirklahv: `}<Kbd>{props.shortKey}</Kbd>
                </>}
            </Grid.Col>
        </Grid>
    );
}

export default HelpText;
