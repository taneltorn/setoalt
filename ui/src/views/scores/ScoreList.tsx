import {Badge, Button, Group, Text, useMantineTheme} from "@mantine/core";
import {useTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import useScoreService from "../../services/ScoreService.tsx";
import {Score} from "../../model/Score.ts";
import {DisplayError, DisplaySuccess} from "../../utils/helpers.tsx";
import {useAuth} from "../../context/AuthContext.tsx";
import Page from "../../Page.tsx";
import PaginatedTable, {Row} from "../../components/table/PaginatedTable.tsx";
import {FaPencil, FaRegTrashCan} from "react-icons/fa6";
import {DialogType, useDialogContext} from "../../context/DialogContext.tsx";
import SearchInput from "../../components/controls/SearchInput.tsx";
import {BiPlus} from "react-icons/bi";
import IconButton from "../../components/controls/IconButton.tsx";
import RemoveScoreDialog from "./components/dialog/RemoveScoreDialog.tsx";
import Header from "../../components/controls/Header.tsx";
import Description from "../../components/controls/Description.tsx";
import {FaRegCopy} from "react-icons/fa";
import {Size} from "../../utils/constants.ts";

const ScoreList: React.FC = () => {

    const {t} = useTranslation();
    const scoreService = useScoreService();
    const [scores, setScores] = useState<Score[]>([]);
    const [filteredScores, setFilteredScores] = useState<Score[]>(scores);

    const navigate = useNavigate();
    const auth = useAuth();
    const {open} = useDialogContext();
    const theme = useMantineTheme();

    const fetchData = () => {
        scoreService.fetchScores()
            .then(r => setScores(r))
            .catch(() => DisplayError(t("toast.error.fetchData")));
    }

    const handleSearch = (value: string) => {
        const str = value?.toLowerCase();
        setFilteredScores(scores.filter(r => r.name?.toLowerCase().includes(str)
            || r.description?.toLowerCase().includes(str)
            || r.text?.toLowerCase().includes(str)
            || r.createdBy?.toLowerCase().includes(str)
            || r.data.stave.name?.toLowerCase().includes(str)
            || r.data.voices.find(v => v.name.toLowerCase().includes(str))
            // || r.data.voices.map(v => v.name.toLowerCase())?.includes(str)
            || r.description?.toLowerCase().includes(str)
        ));
    }

    const cloneScore = (score: Score) => {
        const clone = {...score};
        clone.name = t("view.scores.clonedScore", {name: clone.name});

        scoreService.createScore(clone)
            .then(() => {
                DisplaySuccess(t("toast.success.saveScore"));
                fetchData();
            })
            .catch(() => DisplayError(t("toast.error.saveScore")));
    }

    useEffect(() => {
        fetchData();
        return () => scoreService.cancelSource.cancel();
    }, []);

    useEffect(() => {
        setFilteredScores(scores);
    }, [scores]);

    return (
        <Page title={t("view.scores.title")}>
            <Header>{t("view.scores.title")}</Header>
            <Description>
                {t("view.scores.description", {count: scores.length})}
            </Description>

            <Group justify={"space-between"}>
                <SearchInput
                    onChange={handleSearch}
                    onClear={() => setFilteredScores(scores)}
                />
                {auth.currentUser?.isAuthorized &&
                    <Button size={"md"}
                            variant={"outline"}
                            leftSection={<BiPlus size={Size.icon.SM}/>}
                            onClick={() => navigate("/editor")}>
                        {t("button.addNew")}
                    </Button>}
            </Group>

            <PaginatedTable
                isLoading={scoreService.isLoading}
                columns={[
                    t("view.scores.table.name"),
                    t("view.scores.table.stave"),
                    t("view.scores.table.voices"),
                    t("view.scores.table.createdBy"),
                    t("view.scores.table.visibility"),
                ]}
                rows={filteredScores.map(score => ({
                    name: score.name,
                    data: [
                        <Link to={`/scores/${score.id}`}>
                            <Text fz={"md"} c={theme.primaryColor} fw={"bold"} className={"text-link"}>
                                {score.name}
                            </Text>
                        </Link>,
                        t(`stave.${score.data.stave.name.toLowerCase()}`),
                        <Group gap={4}>
                            {score.data.voices
                                .slice(0, 3)
                                .map(v => v.name)
                                .join(", ")}
                        </Group>,
                        score.createdBy,
                        <Badge
                            bg={score?.visibility === "PUBLIC" ? theme.primaryColor : theme.colors.gray[5]}>
                            {t(`visibility.${score.visibility?.toLowerCase()}`)}
                        </Badge>,
                        auth.currentUser?.isAuthorized &&
                        <Group justify={"end"} wrap={"nowrap"} gap={4}>
                            <IconButton
                                title={t("button.clone")}
                                icon={<FaRegCopy size={Size.icon.XS}/>}
                                onClick={() => cloneScore(score)}
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
                                    onRemove: fetchData
                                })}
                            />
                        </Group>
                    ]
                }) as Row)}
            />

            <RemoveScoreDialog/>
        </Page>
    );
}

export default ScoreList;
