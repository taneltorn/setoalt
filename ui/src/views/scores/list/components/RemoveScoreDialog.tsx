import React from 'react';
import Dialog from "../../../../components/dialog/Dialog.tsx";
import {Trans, useTranslation} from "react-i18next";
import {Text} from "@mantine/core";
import {useDialogContext} from "../../../../hooks/useDialogContext.tsx";
import useScoreService from "../../../../hooks/useScoreService.tsx";
import {DialogType} from "../../../../utils/enums.ts";

const RemoveScoreDialog: React.FC = () => {

    const [t] = useTranslation();
    const {close, context} = useDialogContext();
    const {removeScore} = useScoreService();

    const confirm = async () => {
        removeScore(context.id)
            .then(() => {
                close();
                context.onRemove && context.onRemove();
            });
    }

    return (
        <Dialog
            type={DialogType.REMOVE_SCORE}
            title={t("dialog.removeScore.title")}
            primaryButtonLabel={t("button.confirm")}
            secondaryButtonLabel={t("button.cancel")}
            onPrimaryButtonClick={confirm}
            onSecondaryButtonClick={close}
            onClose={close}
        >
            <Text size={"xl"}>
                <Trans
                    i18nKey="dialog.removeScore.description"
                    values={{name: context.name}}
                />
            </Text>
        </Dialog>
    )
};

export default RemoveScoreDialog;
