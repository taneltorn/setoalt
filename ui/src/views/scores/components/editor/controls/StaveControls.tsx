import React from 'react';
import ControlButton from "../../../../../components/controls/ControlButton.tsx";
import {GiFClef} from "react-icons/gi";
import {useTranslation} from "react-i18next";
import {DialogType, useDialogContext} from "../../../../../context/DialogContext.tsx";

const StaveControls: React.FC = () => {

    const {t} = useTranslation();
    const {open} = useDialogContext();

    return (
        <ControlButton
            tooltip={t("tooltip.staveSelection")}
            label={<GiFClef size={18}/>}
            onClick={() => open(DialogType.STAVE_SELECTION)}
        />
    )
};

export default StaveControls;
