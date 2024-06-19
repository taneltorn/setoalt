import React, {useEffect, useState} from "react";
import {Alert, Group, Pagination, Table, Text} from "@mantine/core";
import {useTranslation} from "react-i18next";
import LoadingOverlay from "../LoadingOverlay.tsx";

interface Properties {
    isLoading?: boolean;
    itemsPerPage?: number;
    columns: string[];
    rows: Row[];
}

export interface Row {
    name: string;
    data: any[];
}

const PaginatedTable: React.FC<Properties> = ({isLoading, columns, rows, ...props}) => {

    const {t} = useTranslation();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = props.itemsPerPage || 20;

    useEffect(() => {
        setCurrentPage(1);
    }, [rows]);

    return (
        <LoadingOverlay isLoading={!!isLoading}>
            <Table highlightOnHover verticalSpacing={"sm"}>
                <Table.Thead>
                    <Table.Tr>
                        {columns.map(c => <Table.Th>{c}</Table.Th>)}
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {rows
                        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                        .map(r => <Table.Tr>
                            {r.data.map(c => <Table.Td>
                                {c}
                            </Table.Td>)}
                        </Table.Tr>)}
                </Table.Tbody>
            </Table>

            {rows.length
                ?
                <Group justify={"space-between"}>
                    <Text size={"sm"} fw={600} c={"gray.8"}>
                        {t("table.results", {count: rows.length})}
                    </Text>
                    <Pagination
                        mt={"md"}
                        mb={"md"}
                        total={Math.ceil(rows.length / itemsPerPage)}
                        onChange={v => setCurrentPage(v)}
                    />
                </Group>
                :
                <Alert variant={"transparent"}>
                    <Group justify={"center"}>
                        <Text>
                            {t("table.noData")}
                        </Text>
                    </Group>
                </Alert>}
        </LoadingOverlay>
    );
}

export default PaginatedTable;
