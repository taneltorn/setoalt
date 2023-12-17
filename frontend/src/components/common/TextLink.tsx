import React from 'react';
import {Anchor} from "@mantine/core";
import {Link as Component} from "react-router-dom";

interface Properties {
    to: string;
    label: string;
    onClick?: () => void;
}

const TextLink: React.FC<Properties> = (props) => {

    return (
        <Component to={props.to}>
            <Anchor fw={700} onClick={props.onClick}>
                {props.label}
            </Anchor>
        </Component>
    )
};

export default TextLink;
