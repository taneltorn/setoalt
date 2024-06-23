import React, {ReactNode} from 'react';
import {Group, Title} from "@mantine/core";

interface Properties {
    leftSection?: ReactNode;
    rightSection?: ReactNode;
    children?: ReactNode;
}

const Header: React.FC<Properties> = (props) => {

    return (
        <Group justify={"space-between"} mb={"md"}>
            <Group>
                {props.leftSection}
                <Title order={1}>
                    {props.children}
                </Title>
            </Group>
            <Group gap={4}>
                {props.rightSection}
            </Group>
        </Group>
    )
};

export default Header;
