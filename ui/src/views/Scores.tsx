import {Button, Text, Title} from "@mantine/core";
import {useTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import ScoreTable from "./ScoreTable.tsx";
import useScoreService from "../services/ScoreService.tsx";
import {Score} from "../models/Score.ts";
import {DisplayGlobalError} from "../utils/helpers.tsx";
import {Role, useAuth} from "../context/AuthContext.tsx";

const ScoreDetails: React.FC = () => {

    const {t} = useTranslation();
    const scoreService = useScoreService();
    const [scores, setScores] = useState<Score[]>([]);
    const auth = useAuth();

    useEffect(() => {
        scoreService.fetchScores()
            .then(r => setScores(r))
            .catch(() => DisplayGlobalError(
                t("toast.error.title"),
                t("toast.error.fetchData"),
            ));
    }, []);

    return (
        <>
            <Title order={1} mb={"xs"}>{t("view.scores.title")}</Title>
            <Text mb={"lg"}>{t("view.scores.description")}</Text>

            <ScoreTable scores={scores}/>

            {[Role.ADMIN, Role.EDITOR].includes(auth.currentUser?.role as Role) &&
                <Link to={"/editor"}>
                    <Button mt={"md"}>Lisa uus</Button>
                </Link>}
        </>
    );
}

export default ScoreDetails;
