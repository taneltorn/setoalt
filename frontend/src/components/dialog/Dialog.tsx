import React from "react";
import {DialogType, useDialogContext} from "../../context/DialogContext.tsx";
import {Button, Group, Modal, Title} from "@mantine/core";

interface Properties {
    title?: string;
    size?: "sm" | "lg" | "xl";
    type: DialogType;
    primaryButtonLabel: string;
    onPrimaryButtonClick: () => void;
    secondaryButtonLabel?: string;
    onSecondaryButtonClick?: () => void;
    onClose?: () => void;
    children?: React.ReactNode;
}

const Dialog: React.FC<Properties> = (props) => {

    const {active, close} = useDialogContext();

    const handleClose = () => {
        close();
        props.onClose && props.onClose();
    }

    return (

        <Modal
            size={"auto"}
            opened={props.type === active}
            onClose={handleClose}
            title={<Title order={3}>{props.title}</Title>}
        >
            <Group>
                {props.children}
            </Group>

            <Group justify={"end"} gap={4} mt={"xl"}>
                {props.secondaryButtonLabel &&
                    <Button
                        size={"md"}
                        variant={"light"}
                        color={"gray.9"}
                        onClick={() => props.onSecondaryButtonClick && props.onSecondaryButtonClick()}
                    >
                        {props.secondaryButtonLabel}
                    </Button>}
                <Button size={"md"} onClick={props.onPrimaryButtonClick}>
                    {props.primaryButtonLabel}
                </Button>
            </Group>
        </Modal>
    )
};

export default Dialog;
