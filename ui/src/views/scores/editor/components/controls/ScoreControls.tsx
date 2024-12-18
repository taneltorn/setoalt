import React from 'react';
import {useTranslation} from "react-i18next";
import {Button, Group} from "@mantine/core";
import {useDataService} from "../../../../../hooks/useDataService.tsx";
import {Role} from "../../../../../utils/enums.ts";

interface Properties {
    onPrimaryButtonClick: () => void;
    onSecondaryButtonClick?: () => void;
    primaryButtonLabel?: string;
    secondaryButtonLabel?: string;
    primaryButtonVariant?: string;
    secondaryButtonVariant?: string;
    primaryButtonRequiresAuth?: Role;
    hidePrimaryButton?: boolean;
    hideSecondaryButton?: boolean;
}

const ScoreControls: React.FC<Properties> = (props) => {

    const {t} = useTranslation();
    const {isSaving} = useDataService();

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
            {!props.hidePrimaryButton &&
                <Button
                    type={"submit"}
                    size={"md"}
                    variant={props.primaryButtonVariant || "filled"}
                    loading={isSaving}
                    onClick={props.onPrimaryButtonClick}
                >
                    {props.primaryButtonLabel || t("button.save")}
                </Button>}
        </Group>
    )
};

export default ScoreControls;
