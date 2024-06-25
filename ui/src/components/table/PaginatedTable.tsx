import React, {useEffect, useState} from "react";
import {Alert, Button, Group, Pagination, Table, Text, useMantineTheme} from "@mantine/core";
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
    const theme = useMantineTheme();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPageOptions = [10, 20, 50];

    const [itemsPerPage, setItemsPerPage] = useState<number>(props.itemsPerPage || itemsPerPageOptions[0]);


    useEffect(() => {
        setCurrentPage(1);
    }, [rows, itemsPerPage]);

    return (
        <LoadingOverlay isLoading={!!isLoading}>
            <Table highlightOnHover verticalSpacing={"sm"}>
                <Table.Thead>
                    <Table.Tr>
                        {columns.map((column, index) => <Table.Th key={index}>{column}</Table.Th>)}
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {rows
                        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
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
                        <Text size={"sm"} c={"gray.8"} mr={"sm"}>
                            {t("table.itemsPerPage")}
                        </Text>
                        {itemsPerPageOptions.map(it => (
                            <Button key={it}
                                    size={"xs"}
                                    color={theme.primaryColor}
                                    variant={it === itemsPerPage ? "filled" : "default"}
                                    onClick={() => setItemsPerPage(it)}>{it}
                            </Button>))}
                        <Text size={"sm"} c={"gray.8"} ml={"md"}>
                            {t("table.results", {count: rows.length})}
                        </Text>

                    </Group>
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
