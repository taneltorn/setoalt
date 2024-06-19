import React from 'react';
import {useTranslation} from "react-i18next";
import {Button, Group} from "@mantine/core";
import PNGExport from "../../export/PNGExport.tsx";
import {useAuth} from "../../../../../context/AuthContext.tsx";

interface Properties {
    onPrimaryButtonClick: () => void;
    hideSecondaryButton?: boolean;
    onSecondaryButtonClick?: () => void;
    primaryButtonLabel?: string;
    primaryButtonVariant?: string;
    secondaryButtonLabel?: string;
    primaryButtonRequiresAuth?: boolean;
}

const ScoreControls: React.FC<Properties> = (props) => {

    const {t} = useTranslation();
    const auth = useAuth();

    return (
        <Group gap={4} justify={"end"}>
            <PNGExport/>
            {!props.hideSecondaryButton &&
                <Button
                    variant={"subtle"}
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
