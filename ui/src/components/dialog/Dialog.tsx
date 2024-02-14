import React from "react";
import {DialogType, useDialogContext} from "../../context/DialogContext.tsx";
import {Button, Group, Modal, Title} from "@mantine/core";

interface Properties {
    title?: string;
    size?: "sm" | "lg" | "xl";
    type: DialogType;
    hidePrimaryButton?: boolean;
    hideSecondaryButton?: boolean;
    primaryButtonLabel?: string;
    onPrimaryButtonClick?: () => void;
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
            size={props.size || "auto"}
            opened={props.type === active}
            closeButtonProps={{size: "xl"}}
            onClose={handleClose}
            title={<Title order={2}>{props.title}</Title>}
        >
            <Group>
                {props.children}
            </Group>

            {!(props.hidePrimaryButton && props.hideSecondaryButton) &&
                <Group justify={"end"} gap={4} mt={"xl"}>
                    {!props.hideSecondaryButton &&
                        <Button size={"md"}
                                variant={"light"}
                                color={"gray.9"}
                                onClick={() => props.onSecondaryButtonClick && props.onSecondaryButtonClick()}>
                            {props.secondaryButtonLabel}
                        </Button>}
                    {!props.hideSecondaryButton &&
                        <Button size={"md"} onClick={() => props.onPrimaryButtonClick && props.onPrimaryButtonClick()}>
                            {props.primaryButtonLabel}
                        </Button>}
                </Group>}
        </Modal>
    )
};

export default Dialog;
