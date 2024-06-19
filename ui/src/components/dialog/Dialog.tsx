import React from "react";
import {DialogType, useDialogContext} from "../../context/DialogContext.tsx";
import {Box, Button, Group, Modal, Title} from "@mantine/core";
import {useTranslation} from "react-i18next";

interface Properties {
    title?: string;
    size?: "sm" | "lg" | "xl";
    type: DialogType;
    hidePrimaryButton?: boolean;
    hideSecondaryButton?: boolean;
    showTertiaryButton?: boolean;
    primaryButtonLabel?: string;
    secondaryButtonLabel?: string;
    tertiaryButtonLabel?: string;
    onPrimaryButtonClick?: () => void;
    onSecondaryButtonClick?: () => void;
    onTertiaryButtonClick?: () => void;
    onClose?: () => void;
    children?: React.ReactNode;
}

const Dialog: React.FC<Properties> = (props) => {

    const {t} = useTranslation();
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
            title={<Title order={2} ml={"md"}>{props.title}</Title>}
        >
            <Box p={"md"}>
                {props.children}
            </Box>

            {!(props.hidePrimaryButton && props.hideSecondaryButton) &&
                <Group justify={"end"} gap={4} mt={"xl"}>
                    {!props.hideSecondaryButton &&
                        <Button size={"md"}
                                variant={"subtle"}
                                color={"black"}
                                onClick={() => props.onSecondaryButtonClick && props.onSecondaryButtonClick()}>
                            {props.secondaryButtonLabel || t("button.cancel")}
                        </Button>}

                    {props.showTertiaryButton &&
                        <Button size={"md"}
                                variant={"outline"}
                                color={"red"}
                                onClick={() => props.onTertiaryButtonClick && props.onTertiaryButtonClick()}>
                            {props.tertiaryButtonLabel}
                        </Button>}

                    {!props.hidePrimaryButton &&
                        <Button size={"md"}

                                onClick={() => props.onPrimaryButtonClick && props.onPrimaryButtonClick()}>
                            {props.primaryButtonLabel || t("button.save")}
                        </Button>}
                </Group>}
        </Modal>
    )
};

export default Dialog;
