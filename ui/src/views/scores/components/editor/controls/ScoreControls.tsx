import React from 'react';
import {useTranslation} from "react-i18next";
import {Button, Group} from "@mantine/core";
import {useAuth} from "../../../../../hooks/useAuth.tsx";

interface Properties {
    onPrimaryButtonClick: () => void;
    onSecondaryButtonClick?: () => void;
    primaryButtonLabel?: string;
    secondaryButtonLabel?: string;
    primaryButtonVariant?: string;
    secondaryButtonVariant?: string;
    primaryButtonRequiresAuth?: boolean;
    hideSecondaryButton?: boolean;
}

const ScoreControls: React.FC<Properties> = (props) => {

    const {t} = useTranslation();
    const auth = useAuth();

    return (
        <Group gap={4} justify={"end"}>
            {!props.hideSecondaryButton &&
                <Button
                    variant={props.secondaryButtonVariant || "subtle"}
                    size={"md"}
                    color={"black"}
                    onClick={props.onSecondaryButtonClick}
                >
                    {props.secondaryButtonLabel || t("button.cancel")}
                </Button>}
            {(!props.primaryButtonRequiresAuth || auth.currentUser?.isAuthorized) &&
                <Button
                    type={"submit"}
                    size={"md"}
                    variant={props.primaryButtonVariant || "filled"}
                    onClick={props.onPrimaryButtonClick}
                >
                    {props.primaryButtonLabel || t("button.save")}
                </Button>}
        </Group>
    )
};

export default ScoreControls;
