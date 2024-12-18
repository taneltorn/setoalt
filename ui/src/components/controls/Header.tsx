import React, {ReactNode} from 'react';
import {Divider, Group, Title, TitleOrder} from "@mantine/core";

interface Properties {
    leftSection?: ReactNode;
    rightSection?: ReactNode;
    children?: ReactNode;
    order?: TitleOrder;
}

const Header: React.FC<Properties> = (props) => {

    return (
        <>
            <Group justify={"space-between"}>
                <Group>
                    {props.leftSection}
                    <Title order={props.order || 2}>
                        {props.children}
                    </Title>
                </Group>
                <Group gap={4}>
                    {props.rightSection}
                </Group>
            </Group>
            <Divider my={"md"}/>
        </>
    )
};

export default Header;
