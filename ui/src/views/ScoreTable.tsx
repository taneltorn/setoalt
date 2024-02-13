import {Badge, Group, Table, useMantineTheme} from "@mantine/core";
import TextLink from "../components/common/TextLink.tsx";
import React from "react";
import {Score} from "../models/Score.ts";
import {MdOutlineEdit} from "react-icons/md";
import {Link} from "react-router-dom";

interface Properties {
    scores: Score[];
}

const ScoreTable: React.FC<Properties> = ({scores}) => {

    const theme = useMantineTheme();

    return (
        <Table highlightOnHover>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Nimi</Table.Th>
                    <Table.Th>Noodijoonestik</Table.Th>
                    <Table.Th>Hääled</Table.Th>
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
                                {score.data.voices.slice(0,3).map((v, i) => <Badge key={i}>{v.name}</Badge>)}
                                {score.data.voices.length > 3 && <Badge>...</Badge>}
                            </Group>
                        </Table.Td>
                        <Table.Td>
                            <Link to={`/scores/${score.id}/edit`}>
                                <MdOutlineEdit size={24} color={theme.colors.gray[8]}/>
                            </Link>
                        </Table.Td>
                    </Table.Tr>
                )}
            </Table.Tbody>
        </Table>
    );
}

export default ScoreTable;
