import React from "react";
import {useTranslation} from "react-i18next";
import {Group} from "@mantine/core";
import {useDialogContext} from "../../../../hooks/useDialogContext.tsx";
import {FaPencil, FaRegTrashCan} from "react-icons/fa6";
import {DialogType} from "../../../../utils/enums.ts";
import IconButton from "../../../../components/controls/IconButton.tsx";
import {Size} from "../../../../utils/constants.ts";
import {Score} from "../../../../model/Score.ts";
import {FaRegCopy} from "react-icons/fa";
import useScoreService from "../../../../hooks/useScoreService.tsx";
import {useNavigate} from "react-router-dom";

interface Properties {
    score: Score;
    onChange: () => void;
}

const ScoreRowControls: React.FC<Properties> = ({score, onChange}) => {

    const {t} = useTranslation();

    const scoreService = useScoreService();
    const navigate = useNavigate();
    const {open} = useDialogContext();

    const handleCloneScore = (score: Score) => {
        scoreService
            .cloneScore(t("view.scoreDetails.clonedScore", {name: score.name}), score)
            .then(onChange);
    }

    return (
        <Group justify={"end"} gap={4} wrap={"nowrap"}>
            <IconButton
                title={t("button.clone")}
                icon={<FaRegCopy size={Size.icon.XS}/>}
                onClick={() => handleCloneScore(score)}
            />

            <IconButton
                title={t("button.edit")}
                icon={<FaPencil size={Size.icon.XS}/>}
                onClick={() => navigate(`/scores/${score.id}/edit`)}
            />

            <IconButton
                title={t("button.remove")}
                icon={<FaRegTrashCan size={Size.icon.XS}/>}
                onClick={() => open(DialogType.REMOVE_SCORE, {
                    id: score.id,
                    name: score.name,
                    onRemove: onChange
                })}
            />
        </Group>
    );
}

export default ScoreRowControls;
