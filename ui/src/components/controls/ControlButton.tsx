import React from 'react';
import {Button} from "@mantine/core";

interface Properties {
    className?: string;
    tooltip?: string;
    shortKey?: string;
    active?: boolean;
    disabled?: boolean;
    label?: string | React.ReactElement;
    icon?: React.ReactElement;
    onClick: () => void;
}

const ControlButton: React.FC<Properties> = (props) => {

    const title = props.tooltip + (props.shortKey ? ` (${props.shortKey})` : "");

    return (
        <Button
            title={title}
            color={"black"}
            data-active={props.active}
            className={"control-button"}
            variant={props.active ? "filled" : "transparent"}
            disabled={props.disabled}
            leftSection={props.icon}
            onClick={props.onClick}
        >
            {props.label}
        </Button>
    )
};

export default ControlButton;
