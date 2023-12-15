import React from 'react';
import {Button, Group, HoverCard, Kbd, Text} from "@mantine/core";

interface Properties {
    className?: string;
    tooltip?: string;
    shortKey?: string;
    active?: boolean;
    disabled?: boolean;
    label: string | React.ReactElement;
    onClick: () => void;
}

const ControlButton: React.FC<Properties> = (props) => {


    return (
        <HoverCard position={"top"} openDelay={0} closeDelay={0} shadow={"md"}>
            <HoverCard.Target>
                <Button
                    color={"black"}
                    data-active={props.active}
                    className={"control-button"}
                    variant={props.active ? "filled" : "transparent"}
                    disabled={props.disabled}
                    onClick={props.onClick}
                >
                    {props.label}
                </Button>
            </HoverCard.Target>
            <HoverCard.Dropdown>
                {props.tooltip &&
                    <Group>
                        <Text>{props.tooltip}  </Text>
                        {props.shortKey && <Kbd>{props.shortKey}</Kbd>}
                    </Group>}
            </HoverCard.Dropdown>
        </HoverCard>
    )
};

export default ControlButton;
