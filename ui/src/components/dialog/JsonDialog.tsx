import React from 'react';
import {useScoreContext} from "../../context/ScoreContext";
import {DialogType, useDialogContext} from "../../context/DialogContext";
import {useTranslation} from "react-i18next";
import Dialog from './Dialog';

const JsonDialog: React.FC = () => {

    const [t] = useTranslation();
    const context = useScoreContext();
    const {close} = useDialogContext();

    const handleCopy = () => {
        navigator.clipboard.writeText(JSON.stringify(context.score));
        close();
    }


    return (
        <Dialog
            type={DialogType.JSON}
            size={"lg"}
            title={"JSON"}
            primaryButtonLabel={t("button.copy")}
            secondaryButtonLabel={t("button.cancel")}
            onPrimaryButtonClick={handleCopy}
            onSecondaryButtonClick={close}
            onClose={close}
        >
            <div style={{maxHeight: 600, overflowY: "scroll"}}>
                <pre>
                    {JSON.stringify(context.score, null, "\t")}
               </pre>
            </div>
        </Dialog>
    )
};

export default JsonDialog;
