import {Badge, Group, Table, Text, useMantineTheme} from "@mantine/core";
import {useTranslation} from "react-i18next";
import React from "react";
import {Link,} from "react-router-dom";
import {Score} from "../../../../model/Score.ts";
import {useAuth} from "../../../../hooks/useAuth.tsx";
import ScoreRowControls from "./ScoreRowControls.tsx";

interface Properties {
    score: Score;
    state: { page: number, query: string }
    onChange: () => void;
}

const ScoreRow: React.FC<Properties> = ({score, state, onChange}) => {

    const {t} = useTranslation();
    const theme = useMantineTheme();
    const auth = useAuth();

    return (
        <Table.Tr>
            <Table.Td>
                <Link to={`/scores/${score.id}`} state={state}>
                    <Text fz={"md"} c={theme.primaryColor} fw={"bold"} className={"text-link"}>
                        {score.name}
                    </Text>
                </Link>
            </Table.Td>
            <Table.Td>{t(`stave.${score.data.stave.name.toLowerCase()}`)}</Table.Td>
            <Table.Td>
                <Group gap={4}>
                    {score.data.voices
                        .slice(0, 3)
                        .map(v => v.name)
                        .join(", ")}
                    {score.data.voices.length > 3 && ", ..."}
                </Group>
            </Table.Td>
            <Table.Td>{score.createdBy}</Table.Td>
            <Table.Td>
                <Badge
                    bg={score?.visibility === "PUBLIC" ? theme.primaryColor : theme.colors.gray[5]}>
                    {t(`visibility.${score.visibility?.toLowerCase()}`)}
                </Badge>
            </Table.Td>
            {auth.currentUser?.isAuthorized &&
                <Table.Td>
                    <ScoreRowControls score={score} onChange={onChange}/>
                </Table.Td>}
        </Table.Tr>
    );
}

export default ScoreRow;
