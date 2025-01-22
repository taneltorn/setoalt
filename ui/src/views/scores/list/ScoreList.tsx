import {Button, Group} from "@mantine/core";
import {useTranslation} from "react-i18next";
import React, {useEffect, useMemo, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import useScoreService from "../../../hooks/useScoreService.tsx";
import {Score} from "../../../model/Score.ts";
import {useAuth} from "../../../hooks/useAuth.tsx";
import Page from "../../../Page.tsx";
import SearchInput from "../../../components/controls/SearchInput.tsx";
import {BiPlus} from "react-icons/bi";
import RemoveScoreDialog from "./components/RemoveScoreDialog.tsx";
import Header from "../../../components/controls/Header.tsx";
import {Size} from "../../../utils/constants.ts";
import {usePagination} from "../../../hooks/usePagination.tsx";
import useSearchQuery from "../../../hooks/useSearchQuery.tsx";
import PaginatedTable from "../../../components/table/PaginatedTable.tsx";
import ScoreRow from "./components/ScoreRow.tsx";
import Description from "../../../components/controls/Description.tsx";

const ScoreList: React.FC = () => {

    const {t} = useTranslation();
    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const {page, setPage} = usePagination();
    const {query, setQuery} = useSearchQuery();
    const {fetchScores, isLoading, cancelSource} = useScoreService();

    const [scores, setScores] = useState<Score[]>([]);

    const fetchData = () => fetchScores().then(setScores);

    const filteredScores = useMemo(() => {
        const lowerCaseQuery = query.toLowerCase();
        return scores.filter(r => r.name?.toLowerCase().includes(lowerCaseQuery)
            || r.description?.toLowerCase().includes(lowerCaseQuery)
            || r.text?.toLowerCase().includes(lowerCaseQuery)
            || r.createdBy?.toLowerCase().includes(lowerCaseQuery)
            || r.data.stave.name?.toLowerCase().includes(lowerCaseQuery)
            || r.data.voices.find(v => v.name.toLowerCase().includes(lowerCaseQuery))
            || r.description?.toLowerCase().includes(lowerCaseQuery)
        );
    }, [scores, query]);

    useEffect(() => {
        fetchData();
        return () => cancelSource.cancel();
    }, []);

    useEffect(() => {
        if (location.state?.query) {
            setQuery(location.state.query);
        }

        if (location.state?.page) {
            setPage(location.state.page);
        }
    }, [location]);

    return (
        <Page title={t("view.scoreList.title")}>
            <Header>{t("view.scoreList.header")}</Header>
            <Description span={12}>

                <Group gap={4}>
                    {t("view.scoreList.starredScores")}
                </Group>
            </Description>

            <Group justify={"space-between"} mt={"lg"} mb={"md"}>
                <SearchInput
                    value={query}
                    onChange={setQuery}
                    onClear={() => setQuery("")}
                />

                {auth.currentUser?.isEditor &&
                    <Button size={"md"}
                            variant={"outline"}
                            leftSection={<BiPlus size={Size.icon.SM}/>}
                            onClick={() => navigate("/editor")}>
                        {t("button.addNew")}
                    </Button>}
            </Group>

            <PaginatedTable
                isLoading={isLoading}
                headers={[
                    t("view.scoreList.table.name"),
                    t("view.scoreList.table.stave"),
                    t("view.scoreList.table.voices"),
                    t("view.scoreList.table.createdBy"),
                    t("view.scoreList.table.visibility"),
                ]}
                rows={filteredScores.map((score) =>
                    <ScoreRow
                        key={score.id}
                        score={score}
                        state={{query: query, page: page}}
                        onChange={fetchData}
                    />)}
            />

            <RemoveScoreDialog/>
        </Page>
    );
}

export default ScoreList;
