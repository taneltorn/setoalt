import React, {useEffect} from "react";
import {Alert, Button, Group, Pagination, Table, Text, useMantineTheme} from "@mantine/core";
import {useTranslation} from "react-i18next";
import LoadingOverlay from "../LoadingOverlay.tsx";
import {PaginationFilter} from "../../model/PaginationFilter.ts";

interface Properties {
    isLoading?: boolean;
    onChange: (q: string) => void;
    pagination: PaginationFilter;
    setPagination: (pagination: PaginationFilter) => void;
    columns: string[];
    rows: Row[];

}

export interface Row {
    name: string;
    data: any[];
}

const PaginatedTable: React.FC<Properties> = ({isLoading, onChange, columns, rows, pagination, setPagination}) => {

    const {t} = useTranslation();
    const theme = useMantineTheme();
    const itemsPerPageOptions = [10, 20, 50];

    useEffect(() => {
        onChange(pagination.query || "");
    }, [pagination]);

    return (
        <LoadingOverlay isLoading={!!isLoading}>
            <Table highlightOnHover verticalSpacing={"sm"} variant={""}>
                <Table.Thead>
                    <Table.Tr>
                        {columns.map((column, index) =>
                            <Table.Th key={index}>
                                <Text fw={"bold"}>
                                    {column}
                                </Text>
                            </Table.Th>)}
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {rows
                        .slice((pagination.page - 1) * pagination.itemsPerPage, pagination.page * pagination.itemsPerPage)
                        .map((row, rowIndex) =>
                            <Table.Tr key={rowIndex}>
                                {row.data.map((cell, cellIndex) =>
                                    <Table.Td key={cellIndex}>
                                        {cell}
                                    </Table.Td>)}
                            </Table.Tr>)}
                </Table.Tbody>
            </Table>

            {rows.length
                ?
                <Group justify={"space-between"}>
                    <Group gap={4}>
                        <Text size={"sm"} c={"gray.8"} mr={"sm"} visibleFrom={"md"}>
                            {t("page.table.itemsPerPage")}
                        </Text>
                        {itemsPerPageOptions.map(it => (
                            <Button
                                key={it}
                                size={"xs"}
                                color={theme.primaryColor}
                                visibleFrom={"md"}
                                variant={it === pagination.itemsPerPage ? "filled" : "default"}
                                onClick={() => setPagination({...pagination, itemsPerPage: it, page: 1})}
                            >
                                {it}
                            </Button>))}
                        <Text size={"sm"} c={"gray.8"} ml={"md"} visibleFrom={"md"}>
                            {t("page.table.results", {count: rows.length})}
                        </Text>

                    </Group>
                    <Pagination
                        mt={"md"}
                        mb={"md"}
                        value={pagination.page}
                        total={Math.ceil(rows.length / pagination.itemsPerPage)}
                        onChange={v => setPagination({...pagination, page: v})}
                    />
                </Group>
                :
                <Alert variant={"transparent"}>
                    <Group justify={"center"}>
                        <Text>
                            {t("page.table.noData")}
                        </Text>
                    </Group>
                </Alert>}
        </LoadingOverlay>
    );
}

export default PaginatedTable;
