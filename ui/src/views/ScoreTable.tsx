import {Badge, Group, Table, useMantineTheme} from "@mantine/core";
import TextLink from "../components/common/TextLink.tsx";
import React from "react";
import {Score} from "../models/Score.ts";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {DialogType, useDialogContext} from "../context/DialogContext.tsx";
import {BsFillPencilFill, BsTrash} from "react-icons/bs";

interface Properties {
    scores: Score[];
    onScoreRemove: () => void;
}

const ScoreTable: React.FC<Properties> = ({scores, onScoreRemove}) => {

    const {t} = useTranslation();
    const {open} = useDialogContext();
    const theme = useMantineTheme();
    const navigate = useNavigate();

    return (
        <Table highlightOnHover>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>{t("view.scores.table.name")}</Table.Th>
                    <Table.Th>{t("view.scores.table.stave")}</Table.Th>
                    <Table.Th>{t("view.scores.table.voices")}</Table.Th>
                    <Table.Th>{t("view.scores.table.createdBy")}</Table.Th>
                    <Table.Th>{t("view.scores.table.visibility")}</Table.Th>
                    <Table.Th/>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {scores.map((score, index) =>
                    <Table.Tr key={index}>
                        <Table.Td>
                            <TextLink to={`/scores/${score.id}`} label={score.name}/>
                        </Table.Td>

                        <Table.Td>
                            {score.data.stave.name}
                        </Table.Td>

                        <Table.Td>
                            <Group gap={4}>
                                {score.data.voices
                                    .slice(0, 3)
                                    .map(v => v.name)
                                    .join(", ")}
                            </Group>
                        </Table.Td>

                        <Table.Td>
                            {score.createdBy}
                        </Table.Td>

                        <Table.Td>
                            <Badge bg={score?.visibility === "PUBLIC" ? theme.primaryColor : theme.colors.gray[5]}>
                                {t(`label.${score.visibility?.toLowerCase()}`)}
                            </Badge>
                        </Table.Td>

                        <Table.Td>
                            <Group justify={"end"}>
                                <BsFillPencilFill
                                    size={24}
                                    className={"hover-pointer"}
                                    color={theme.colors.gray[7]}
                                    onClick={() => navigate(`/scores/${score.id}/edit`)}
                                />
                                <BsTrash
                                    size={24}
                                    className={"hover-pointer"}
                                    color={theme.colors.gray[7]}
                                    onClick={() => open(DialogType.REMOVE_SCORE, {
                                        id: score.id,
                                        name: score.name,
                                        onRemove: onScoreRemove
                                    })}
                                />
                            </Group>
                        </Table.Td>
                    </Table.Tr>
                )}
            </Table.Tbody>
        </Table>
    );
}

export default ScoreTable;
