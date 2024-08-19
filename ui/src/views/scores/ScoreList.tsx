import {Badge, Button, Group, Text, useMantineTheme} from "@mantine/core";
import {useTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import useScoreService from "../../hooks/useScoreService.tsx";
import {Score} from "../../model/Score.ts";
import {DisplayError, DisplaySuccess} from "../../utils/helpers.tsx";
import {useAuth} from "../../hooks/useAuth.tsx";
import Page from "../../Page.tsx";
import PaginatedTable, {Row} from "../../components/table/PaginatedTable.tsx";
import {FaPencil, FaRegTrashCan} from "react-icons/fa6";
import {useDialogContext} from "../../hooks/useDialogContext.tsx";
import SearchInput from "../../components/controls/SearchInput.tsx";
import {BiPlus} from "react-icons/bi";
import IconButton from "../../components/controls/IconButton.tsx";
import RemoveScoreDialog from "./components/dialog/RemoveScoreDialog.tsx";
import Header from "../../components/controls/Header.tsx";
import {FaRegCopy} from "react-icons/fa";
import {Size} from "../../utils/constants.ts";
import usePagination from "../../hooks/usePagination.tsx";
import {DialogType} from "../../utils/enums.ts";

const ScoreList: React.FC = () => {

    const {t} = useTranslation();2
    const scoreService = useScoreService();
    const [scores, setScores] = useState<Score[]>([]);
    const [filteredScores, setFilteredScores] = useState<Score[]>(scores);

    const {pagination, setPagination} = usePagination();
    const navigate = useNavigate();
    const location = useLocation();

    const auth = useAuth();
    const {open} = useDialogContext();
    const theme = useMantineTheme();

    const fetchData = () => {
        scoreService.fetchScores()
            .then(r => setScores(r))
            .catch(() => DisplayError(t("toast.error.fetchData")));
    }

    const handleSearch = (value: string) => {
        const query = value?.toLowerCase();
        setFilteredScores(scores.filter(r => r.name?.toLowerCase().includes(query)
            || r.description?.toLowerCase().includes(query)
            || r.text?.toLowerCase().includes(query)
            || r.createdBy?.toLowerCase().includes(query)
            || r.data.stave.name?.toLowerCase().includes(query)
            || r.data.voices.find(v => v.name.toLowerCase().includes(query))
            || r.description?.toLowerCase().includes(query)
        ));
    }

    const cloneScore = (score: Score) => {
        const clone = {...score};
        clone.name = t("view.scoreDetails.clonedScore", {name: clone.name});

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
        handleSearch(pagination.query);
    }, [scores]);

    useEffect(() => {
        if (location.state?.pagination) {
            setPagination(location.state.pagination);
        }
    }, [location]);

    return (
        <Page title={t("view.scoreList.title")}>
            <Header>{t("view.scoreList.header")}</Header>

            <Group justify={"space-between"} mt={"lg"} mb={"md"}>
                <SearchInput
                    value={pagination.query}
                    onChange={v => setPagination({...pagination, query: v, page: 1})}
                    onClear={() => setPagination({...pagination, query: "", page: 1})}
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
                onChange={handleSearch}
                pagination={pagination}
                setPagination={setPagination}
                columns={[
                    t("view.scoreList.table.name"),
                    t("view.scoreList.table.stave"),
                    t("view.scoreList.table.voices"),
                    t("view.scoreList.table.createdBy"),
                    t("view.scoreList.table.visibility"),
                ]}
                rows={filteredScores.map(score => ({
                    name: score.name,
                    data: [
                        <Link to={`/scores/${score.id}`} state={{pagination: pagination}}>
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
                            {score.data.voices.length > 3 && ", ..."}
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
                                onClick={() => navigate(`/scores/${score.id}/edit`, {state: {pagination: pagination}})}
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
