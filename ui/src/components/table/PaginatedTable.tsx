import React, {ReactNode} from "react";
import {Alert, Button, Group, Pagination, Table, Text, useMantineTheme} from "@mantine/core";
import {useTranslation} from "react-i18next";
import LoadingOverlay from "../LoadingOverlay.tsx";
import {usePagination} from "../../hooks/usePagination.tsx";
import {ItemsPerPageOptions} from "../../context/PaginationContext.tsx";

interface Properties {
    isLoading?: boolean;
    headers: string[];
    rows: ReactNode[];
}

const PaginatedTable: React.FC<Properties> = ({isLoading, headers, rows}) => {

    const {t} = useTranslation();
    const theme = useMantineTheme();

    const {page, setPage, itemsPerPage, setItemsPerPage} = usePagination();

    const handleItemsPerPageChange = (itemsPerPage: number) => {
        setItemsPerPage(itemsPerPage);
        setPage(1);
    }

    return (
        <LoadingOverlay isLoading={!!isLoading}>
            <Table highlightOnHover verticalSpacing={"sm"} variant={""}>
                <Table.Thead>
                    <Table.Tr>
                        {headers.map((column, index) =>
                            <Table.Th key={index}>
                                <Text fw={"bold"}>
                                    {column}
                                </Text>
                            </Table.Th>)}
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {rows
                        .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                        .map((row, rowIndex) => <React.Fragment key={rowIndex}>{row}</React.Fragment>)}
                </Table.Tbody>
            </Table>

            {rows.length
                ? <Group justify={"space-between"}>
                    <Group gap={4}>
                        <Text size={"sm"} c={"gray.8"} mr={"sm"} visibleFrom={"md"}>
                            {t("page.table.itemsPerPage")}
                        </Text>
                        {ItemsPerPageOptions.map(it => (
                            <Button
                                key={it}
                                size={"xs"}
                                color={theme.primaryColor}
                                visibleFrom={"md"}
                                variant={it === itemsPerPage ? "filled" : "default"}
                                onClick={() => handleItemsPerPageChange(it)}
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
                        value={page}
                        total={Math.ceil(rows.length / itemsPerPage)}
                        onChange={v => setPage(v)}
                    />
                </Group>
                : <Alert variant={"transparent"}>
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
