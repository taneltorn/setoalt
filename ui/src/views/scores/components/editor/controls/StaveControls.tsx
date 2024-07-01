import React from 'react';
import ControlButton from "../../../../../components/controls/ControlButton.tsx";
import {GiFClef} from "react-icons/gi";
import {useTranslation} from "react-i18next";
import {DialogType, useDialogContext} from "../../../../../context/DialogContext.tsx";
import {Size} from "../../../../../utils/constants.ts";
import {useScoreContext} from "../../../../../context/ScoreContext.tsx";

const StaveControls: React.FC = () => {

    const {t} = useTranslation();
    const context = useScoreContext();
    const {open} = useDialogContext();

    return (
        <ControlButton
            tooltip={t("tooltip.staveSelection")}
            disabled={!!context.score.id}
            onClick={() => open(DialogType.STAVE_SELECTION)}
        >
            <GiFClef size={Size.icon.SM}/>
        </ControlButton>
    )
};

export default StaveControls;