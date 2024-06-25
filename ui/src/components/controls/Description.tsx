import React, {ReactNode} from 'react';
import {Grid, Text} from "@mantine/core";

interface Properties {
    children?: ReactNode;
    span?: any;
}

const Description: React.FC<Properties> = (props) => {

    return (
        <Grid mb={"md"}>
            <Grid.Col span={props.span || {xs: 12, lg: 7}}>
                <Text>{props.children}</Text>
            </Grid.Col>
        </Grid>
    )
};

export default Description;
