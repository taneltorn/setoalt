import React from 'react';
import {useScoreContext} from "../../../../../hooks/useScoreContext.tsx";
import Dialog from "../../../../../components/dialog/Dialog.tsx";
import {useDialogContext} from "../../../../../hooks/useDialogContext.tsx";
import {useTranslation} from "react-i18next";
import {Text} from "@mantine/core";
import {EmptyScore} from "../../../../../utils/helpers.tsx";
import {DefaultVoices} from "../../../../../utils/dictionaries.ts";
import {useHistory} from "../../../../../hooks/useHistory.tsx";
import {DialogType} from "../../../../../utils/enums.ts";

const ResetScoreDialog: React.FC = () => {

    const [t] = useTranslation();
    const history = useHistory();
    const {setActiveVoice, setActivePosition, setLoopRange, setScore} = useScoreContext();
    const {close} = useDialogContext();

    const confirm = () => {
        setScore(structuredClone(EmptyScore));
        setActiveVoice(DefaultVoices[0].name);
        setActivePosition(0);
        setLoopRange(undefined);
        history.setUndoStates([]);
        history.setRedoStates([]);
        history.setRecoverStates([]);

        close();
    }

    return (
        <Dialog
            type={DialogType.CLEAR_SCORE}
            title={t("dialog.resetScore.title")}
            primaryButtonLabel={t("button.confirm")}
            secondaryButtonLabel={t("button.cancel")}
            onPrimaryButtonClick={confirm}
            onSecondaryButtonClick={close}
            onClose={close}
        >
            <Text size={"xl"} mb={"xl"}>
                {t("dialog.resetScore.description")}
            </Text>
        </Dialog>
    )
};

export default ResetScoreDialog;
