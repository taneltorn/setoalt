import React, {ReactNode} from 'react';
import {Grid, Text} from "@mantine/core";

interface Properties {
    children?: ReactNode;
}

const Description: React.FC<Properties> = (props) => {

    return (
        <Grid mb={"md"}>
            <Grid.Col span={{xs: 12, lg: 8}}>
                <Text>{props.children}</Text>
            </Grid.Col>
        </Grid>
    )
};

export default Description;
