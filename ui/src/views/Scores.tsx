import {Badge, Button, Grid, Group, Text, Title, useMantineTheme} from "@mantine/core";
import {useTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import useScoreService from "../services/ScoreService.tsx";
import {Score} from "../models/Score.ts";
import {DisplayError} from "../utils/helpers.tsx";
import {useAuth} from "../context/AuthContext.tsx";
import RemoveScoreDialog from "../components/dialog/RemoveScoreDialog.tsx";
import Page from "../Page.tsx";
import FilterableTable, {Row} from "../components/table/FilterableTable.tsx";
import TextLink from "../components/common/TextLink.tsx";
import {FaPencil, FaRegTrashCan} from "react-icons/fa6";
import {DialogType, useDialogContext} from "../context/DialogContext.tsx";

const ScoreDetails: React.FC = () => {

    const {t} = useTranslation();
    const scoreService = useScoreService();
    const [scores, setScores] = useState<Score[]>([]);
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

    useEffect(() => {
        fetchData();
        return () => scoreService.cancelSource.cancel();
    }, []);

    return (
        <Page title={t("view.scores.title")}>
            <Title order={1} mb={"xs"}>{t("view.scores.title")}</Title>
            <Text mb={"lg"}>{t("view.scores.description")}</Text>

            <Grid>
                <Grid.Col span={10}>
                    <FilterableTable
                        columns={[
                            t("view.scores.table.name"),
                            t("view.scores.table.stave"),
                            t("view.scores.table.voices"),
                            t("view.scores.table.createdBy"),
                            t("view.scores.table.visibility"),
                        ]}
                        rows={scores.map(score => ({
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
                                <Badge bg={score?.visibility === "PUBLIC" ? theme.primaryColor : theme.colors.gray[5]}>
                                    {t(`visibility.${score.visibility?.toLowerCase()}`)}
                                </Badge>,
                                <Group justify={"end"} wrap={"nowrap"}>
                                    <FaPencil
                                        size={20}
                                        className={"hover-pointer"}
                                        title={t("button.edit")}
                                        color={theme.colors.gray[7]}
                                        onClick={() => navigate(`/scores/${score.id}/edit`)}
                                    />
                                    <FaRegTrashCan
                                        size={20}
                                        className={"hover-pointer"}
                                        title={t("button.remove")}
                                        color={theme.colors.gray[7]}
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
                </Grid.Col>
            </Grid>

            <RemoveScoreDialog/>

            {auth.currentUser?.isAuthorized &&
                <Button mt={"md"} onClick={() => navigate("/editor")}>
                    {t("button.addNew")}
                </Button>}
        </Page>
    );
}

export default ScoreDetails;
