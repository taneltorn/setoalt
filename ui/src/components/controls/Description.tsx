import React from 'react';
import {Grid, Text} from "@mantine/core";

interface Properties {
    text?: string;
}

const Description: React.FC<Properties> = (props) => {

    return (
        <Grid mb={"md"}>
            <Grid.Col span={8}>
                <Text>{props.text}</Text>
            </Grid.Col>
        </Grid>
    )
};

export default Description;
