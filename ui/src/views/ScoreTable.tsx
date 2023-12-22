import {Badge, Group, Table} from "@mantine/core";
import TextLink from "../components/common/TextLink.tsx";
import React from "react";
import {Score} from "../models/Score.ts";

interface Properties {
    scores: Score[];
}

const ScoreTable: React.FC<Properties> = ({scores}) => {

    return (
        <Table highlightOnHover>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Nimi</Table.Th>
                    <Table.Th>Noodijoonestik</Table.Th>
                    <Table.Th>Hääled</Table.Th>
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
                                {score.data.voices.map((v, i) =>
                                    <Badge key={i}>{v.name}</Badge>
                                )}
                            </Group>
                        </Table.Td>
                    </Table.Tr>
                )}
            </Table.Tbody>
        </Table>
    );
}

export default ScoreTable;
