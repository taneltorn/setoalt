import {Badge, Group, Table} from "@mantine/core";
import TextLink from "../components/common/TextLink.tsx";
import React from "react";

interface ScoreRow {
    id: string;
    title: string;
    stave: string;
    voices: string[];
    inserted?: string;
}

interface Properties {
    rows: ScoreRow[];
}

const ScoreTable: React.FC<Properties> = ({rows}) => {

    return (
        <Table highlightOnHover>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Nimi</Table.Th>
                    <Table.Th>Noodijoonestik</Table.Th>
                    <Table.Th>Hääled</Table.Th>
                    <Table.Th>Lisatud</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {rows.map((row, index) =>
                    <Table.Tr key={index}>
                        <Table.Td>
                            <TextLink to={`/scores/${row.id}`} label={row.title}/>
                        </Table.Td>
                        <Table.Td>
                            {row.stave}
                        </Table.Td>
                        <Table.Td>
                            <Group gap={4}>
                                {row.voices.map((v, i) =>
                                    <Badge key={i}>{v}</Badge>
                                )}
                            </Group>
                        </Table.Td>
                        <Table.Td>{row.inserted}</Table.Td>
                    </Table.Tr>
                )}
            </Table.Tbody>
        </Table>
    );
}

export default ScoreTable;
