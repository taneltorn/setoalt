import React, {ReactNode} from 'react';
import {ActionIcon} from "@mantine/core";

interface Properties {
    className?: string;
    tooltip?: string;
    shortKey?: string;
    active?: boolean;
    disabled?: boolean;
    onClick: () => void;
    children?: ReactNode;
}

const ControlButton: React.FC<Properties> = (props) => {

    const title = props.tooltip + (props.shortKey ? ` (${props.shortKey})` : "");

    return (
        <ActionIcon
            title={title}
            size={40}
            w={55}
            color={"black"}
            data-active={props.active}
            className={"control-button"}
            variant={props.active ? "filled" : "transparent"}
            disabled={props.disabled}
            onClick={props.onClick}
        >
            {props.children}
        </ActionIcon>
    )
};

export default ControlButton;
