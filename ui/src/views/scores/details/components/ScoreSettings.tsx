import React from "react";
import {ActionIcon, Group, Loader, Menu, Text} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {useScoreContext} from "../../../../hooks/useScoreContext.tsx";
import {BsCodeSlash, BsFiletypePng} from "react-icons/bs";
import {Size} from "../../../../utils/constants.ts";
import {useDialogContext} from "../../../../hooks/useDialogContext.tsx";
import {IoSettingsOutline} from "react-icons/io5";
import {FaItunesNote, FaRegCopy} from "react-icons/fa";
import {DialogType} from "../../../../utils/enums.ts";
import Help from "../../../../components/Help.tsx";
import useScoreService from "../../../../hooks/useScoreService.tsx";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../../../hooks/useAuth.tsx";
import useScoreExport from "../../../../hooks/useScoreExport.tsx";

export enum Setting {
    CHANGE_MODE,
    EXPORT_PNG,
    EMBED_CODE,
    CLONE_SCORE
}

interface Properties {
    settings: Setting[];
}

const ScoreSettings: React.FC<Properties> = ({settings}) => {

    const {t} = useTranslation();

    const navigate = useNavigate();
    const auth = useAuth();
    const scoreService = useScoreService();
    const {score, isSimplifiedMode, setIsSimplifiedMode} = useScoreContext();
    const {open} = useDialogContext();
    const {exportToPng, isLoading} = useScoreExport();

    const handleCloneScore = () => {
        scoreService
            .cloneScore(t("view.scoreDetails.clonedScore", {name: score.name}), score)
            .then((response) => {
                if (response) {
                    navigate(`/scores/${response.id}`);
                }
            });
    }

    return (
        <Group gap={4}>
            <Help tab={location.pathname.includes("edit") ? "editor" : "playback"}/>
            <Menu shadow={"md"} position={"bottom-end"}>
                <Menu.Target>
                    <ActionIcon
                        size={"xl"}
                        variant={"subtle"}
                        color={"gray"}
                        data-active={"true"}
                        title={t("button.settings")}
                    >
                        {isLoading
                            ? <Loader size={Size.icon.MD}/>
                            : <IoSettingsOutline size={Size.icon.MD}/>}
                    </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                    {settings.includes(Setting.CHANGE_MODE) &&
                        <Menu.Item onClick={() => setIsSimplifiedMode(!isSimplifiedMode)}>
                            <Group>
                                <FaItunesNote size={Size.icon.SM}/>
                                <Text
                                    mr={"md"}>{t(`view.scoreDetails.settings.${isSimplifiedMode ? "selectDetailMode" : "selectSimplifiedMode"}`)}</Text>
                            </Group>
                        </Menu.Item>}

                    {settings.includes(Setting.EMBED_CODE) &&
                        <Menu.Item onClick={() => open(DialogType.EMBED_SCORE)}>
                            <Group>
                                <BsCodeSlash size={Size.icon.SM}/>
                                <Text mr={"md"}>{t("view.scoreDetails.settings.embedScore")}</Text>
                            </Group>
                        </Menu.Item>}

                    {settings.includes(Setting.EXPORT_PNG) &&
                        <Menu.Item onClick={exportToPng}>
                            <Group>
                                <BsFiletypePng size={Size.icon.SM}/>
                                <Text mr={"md"}>{t("view.scoreDetails.settings.exportPng")}</Text>
                            </Group>
                        </Menu.Item>}

                    {settings.includes(Setting.CLONE_SCORE) && auth.currentUser?.isAuthorized &&
                        <Menu.Item onClick={handleCloneScore}>
                            <Group>
                                <FaRegCopy size={Size.icon.SM}/>
                                <Text mr={"md"}>{t("view.scoreDetails.settings.cloneScore")}</Text>
                            </Group>
                        </Menu.Item>}
                </Menu.Dropdown>
            </Menu>
        </Group>
    );
};

export default ScoreSettings;
