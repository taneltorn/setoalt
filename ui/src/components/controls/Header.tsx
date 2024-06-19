import React, {ReactNode} from 'react';
import {Group, Title} from "@mantine/core";

interface Properties {
    text: string;
    leftSection?: ReactNode;
    rightSection?: ReactNode;
}

const Header: React.FC<Properties> = (props) => {

    return (
        <Group mb={"md"}>
            {props.leftSection}
            <Title order={1}>
                {props.text}
            </Title>
            {props.rightSection}
        </Group>
    )
};

export default Header;
