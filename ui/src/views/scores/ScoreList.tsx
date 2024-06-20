import {Badge, Button, Group, Text, useMantineTheme} from "@mantine/core";
import {useTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import useScoreService from "../../services/ScoreService.tsx";
import {Score} from "../../models/Score.ts";
import {DisplayError} from "../../utils/helpers.tsx";
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
import ControlPanel from "../../components/controls/ControlPanel.tsx";

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
            <Header text={t("view.scores.title")}/>
            <Description text={t("view.scores.description")}/>


            <ControlPanel
                leftSection={
                    <SearchInput
                        onChange={handleSearch}
                        onClear={() => setFilteredScores(scores)}
                    />}
                rightSection={auth.currentUser?.isAuthorized &&
                    <Button size={"md"}
                            variant={"outline"}
                            leftSection={<BiPlus size={24}/>}
                            onClick={() => navigate("/editor")}>
                        {t("button.addNew")}
                    </Button>}
            />

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
                            <Text fz={"md"} c={"red"} fw={"bold"}>
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
