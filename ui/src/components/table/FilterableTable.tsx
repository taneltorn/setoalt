import React, {useEffect, useState} from "react";
import {Alert, CloseButton, Group, Input, Pagination, Table, Text} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {CiSearch} from "react-icons/ci";

interface Properties {
    columns: string[];
    rows: Row[];
}

export interface Row {
    name: string;
    data: any[];
}

const FilterableTable: React.FC<Properties> = ({columns, rows}) => {

    const {t} = useTranslation();
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [filteredRows, setFilteredRows] = useState<Row[]>(rows);


    useEffect(() => {
        setCurrentPage(1);

        if (search.length > 0) {
            setFilteredRows(rows.filter(r => r.name?.toLowerCase().includes(search?.toLowerCase())));
            return;
        }
        setFilteredRows(rows);
    }, [rows, search]);

    return (
        <>
            <Group>
                <Input
                    placeholder={t("view.scores.search")}
                    mb="md"
                    size={"lg"}
                    value={search}
                    onChange={e => setSearch(e.currentTarget.value)}
                    leftSection={<CiSearch size={24}/>}
                    rightSectionPointerEvents="all"
                    rightSection={
                        <CloseButton
                            className={"hover-pointer"}
                            onClick={() => setSearch("")}
                            style={{display: search ? undefined : 'none'}}
                        />
                    }/>
            </Group>

            <Table highlightOnHover verticalSpacing={"sm"}>
                <Table.Thead>
                    <Table.Tr>
                        {columns.map(c => <Table.Th>{c}</Table.Th>)}
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {filteredRows
                        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                        .map(r => <Table.Tr>
                            {r.data.map(c => <Table.Td>
                                {c}
                            </Table.Td>)}
                        </Table.Tr>)}
                </Table.Tbody>
            </Table>

            <Pagination
                mt={"md"}
                mb={"md"}
                total={Math.ceil(filteredRows.length / itemsPerPage)}
                onChange={v => setCurrentPage(v)}
            />

            {!filteredRows.length &&
                <Alert variant={"transparent"}>
                    <Group justify={"center"}>
                        <Text>
                            {t("table.noData")}
                        </Text>
                    </Group>
                </Alert>}
        </>
    );
}

export default FilterableTable;
