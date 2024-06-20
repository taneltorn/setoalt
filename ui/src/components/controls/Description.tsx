import React from 'react';
import {Grid, Text} from "@mantine/core";

interface Properties {
    text?: string;
    span?: number;
}

const Description: React.FC<Properties> = (props) => {

    return (
        <Grid mb={"md"}>
            <Grid.Col span={props.span || 8}>
                <Text>{props.text}</Text>
            </Grid.Col>
        </Grid>
    )
};

export default Description;
