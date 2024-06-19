import {Badge, Button, Group, Text, Title, useMantineTheme} from "@mantine/core";
import {useTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import useScoreService from "../../services/ScoreService.tsx";
import {Score} from "../../models/Score.ts";
import {DisplayError} from "../../utils/helpers.tsx";
import {useAuth} from "../../context/AuthContext.tsx";
import RemoveScoreDialog from "./components/common/dialog/RemoveScoreDialog.tsx";
import Page from "../../Page.tsx";
import PaginatedTable, {Row} from "../../components/table/PaginatedTable.tsx";
import TextLink from "../../components/controls/TextLink.tsx";
import {FaPencil, FaRegTrashCan} from "react-icons/fa6";
import {DialogType, useDialogContext} from "../../context/DialogContext.tsx";
import SearchInput from "../../components/controls/SearchInput.tsx";
import {BiPlus} from "react-icons/bi";
import IconButton from "../../components/controls/IconButton.tsx";

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
            .catch(() => DisplayError(
                t("toast.error.title"),
                t("toast.error.fetchData"),
            ));
    }

    const handleSearch = (value: string) => {
        setFilteredScores(scores.filter(r => r.name?.toLowerCase().includes(value?.toLowerCase())));
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
            <Title order={1} mb={"lg"}>
                {t("view.scores.title")}
            </Title>

            <Text mb={"lg"}>
                {t("view.scores.description")}
            </Text>

            <Group justify={"space-between"} mb={"md"}>
                <SearchInput onChange={handleSearch}
                             onClear={() => setFilteredScores(scores)}/>

                {auth.currentUser?.isAuthorized &&
                    <Button size={"md"}
                            variant={"subtle"}
                            leftSection={<BiPlus size={24}/>}
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
                        <TextLink to={`/scores/${score.id}`} label={score.name}/>,
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
                        <Group justify={"end"} wrap={"nowrap"} gap={4}>
                            <IconButton
                                icon={<FaPencil size={20}/>}
                                onClick={() => navigate(`/scores/${score.id}/edit`)}
                            />

                            <IconButton
                                icon={<FaRegTrashCan size={20}/>}
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
