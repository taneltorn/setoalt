import {Button, CloseButton, Group, Input, Text, Title} from "@mantine/core";
import {useTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import ScoreTable from "../components/table/ScoreTable.tsx";
import useScoreService from "../services/ScoreService.tsx";
import {Score} from "../models/Score.ts";
import {DisplayError} from "../utils/helpers.tsx";
import {useAuth} from "../context/AuthContext.tsx";
import RemoveScoreDialog from "../components/dialog/RemoveScoreDialog.tsx";
import {CiSearch} from "react-icons/ci";

const ScoreDetails: React.FC = () => {

    const {t} = useTranslation();
    const scoreService = useScoreService();
    const [scores, setScores] = useState<Score[]>([]);
    const [filteredScores, setFilteredScores] = useState<Score[]>([]);
    const navigate = useNavigate();
    const [search, setSearch] = useState<string>("");

    const auth = useAuth();

    const fetchData = () => {
        scoreService.fetchScores()
            .then(r => setScores(r))
            .catch(() => DisplayError(
                t("toast.error.title"),
                t("toast.error.fetchData"),
            ));
    }

    useEffect(() => {
        fetchData();
        return () => scoreService.cancelSource.cancel();
    }, []);


    useEffect(() => {
        const s = search.length > 0
            ? scores.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
            : scores;
        setFilteredScores(s);
    }, [scores, search]);

    return (
        <>
            <Title order={1} mb={"xs"}>{t("view.scores.title")}</Title>
            <Text mb={"lg"}>{t("view.scores.description")}</Text>

            <Group>
                <Input
                    placeholder={t("view.scores.search")}
                    mb="md"
                    size={"lg"}
                    value={search}
                    onChange={e => setSearch(e.currentTarget.value)}
                    leftSection={<CiSearch size={24}/>}
                    rightSectionPointerEvents="all"
                    rightSection={
                        <CloseButton
                            className={"hover-pointer"}
                            onClick={() => setSearch("")}
                            style={{display: search ? undefined : 'none'}}
                        />
                    }/>
            </Group>
            <ScoreTable scores={filteredScores} refresh={fetchData}/>

            <RemoveScoreDialog/>

            {auth.currentUser?.isAuthorized &&
                <Button mt={"md"} onClick={() => navigate("/editor")}>
                    {t("button.addNew")}
                </Button>}
        </>
    );
}

export default ScoreDetails;
