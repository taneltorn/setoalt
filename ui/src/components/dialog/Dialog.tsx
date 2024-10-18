import React from "react";
import {useDialogContext} from "../../hooks/useDialogContext.tsx";
import {Box, Button, Group, Modal, ScrollArea} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {DialogType} from "../../utils/enums.ts";

interface Properties {
    title?: string;
    size?: "sm" | "lg" | "xl";
    type: DialogType;
    hidePrimaryButton?: boolean;
    hideSecondaryButton?: boolean;
    primaryButtonLabel?: string;
    secondaryButtonLabel?: string;
    onPrimaryButtonClick?: () => void;
    onSecondaryButtonClick?: () => void;
    onClose?: () => void;
    children?: React.ReactNode;
    isLoading?: boolean;
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
            title={props.title}
            scrollAreaComponent={ScrollArea.Autosize}
            styles={{
                title: {
                    marginLeft: "14px",
                    fontSize: '24px',
                    fontWeight: 'bold',
                },
            }}
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

                    {!props.hidePrimaryButton &&
                        <Button size={"md"}
                                loading={props.isLoading}
                                onClick={() => props.onPrimaryButtonClick && props.onPrimaryButtonClick()}>
                            {props.primaryButtonLabel || t("button.save")}
                        </Button>}
                </Group>}
        </Modal>
    )
};

export default Dialog;
