import React from 'react';
import {ActionIcon} from "@mantine/core";

interface Properties {
    className?: string;
    title?: string;
    disabled?: boolean;
    icon: React.ReactElement;
    onClick: () => void;
}

const ControlButton: React.FC<Properties> = (props) => {

    return (
        <ActionIcon
            title={props.title}
            color={"black"}
            size={"lg"}
            className={"control-button"}
            variant={"transparent"}
            disabled={props.disabled}
            onClick={props.onClick}
        >
            {props.icon}
        </ActionIcon>
    )
};

export default ControlButton;
