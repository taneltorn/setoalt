import React from 'react';
import {Anchor} from "@mantine/core";
import {Link as Component} from "react-router-dom";

interface Properties {
    to: string;
    label: string;
    target?: string;
    prefix?: string;
    onClick?: () => void;
}

const TextLink: React.FC<Properties> = (props) => {

    // todo fix anchor a error
    return (
        <Component to={props.to} target={props.target}>
            {props.prefix}
            <Anchor fw={700} onClick={props.onClick}>
                {props.label}
            </Anchor>
        </Component>
    )
};

export default TextLink;
