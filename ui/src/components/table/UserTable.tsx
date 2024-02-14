import React from "react";
import {Alert, Group, Table, Text, useMantineTheme} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {BsTrash} from "react-icons/bs";
import {DialogType, useDialogContext} from "../../context/DialogContext.tsx";
import {User} from "../../models/User.ts";

interface Properties {
    users: User[];
    refresh: () => void;
}

const ScoreTable: React.FC<Properties> = ({users, refresh}) => {

    const {t} = useTranslation();
    const theme = useMantineTheme();
    const {open} = useDialogContext();

    return (
        <>
            <Table highlightOnHover verticalSpacing={"sm"}>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>{t("view.admin.table.id")}</Table.Th>
                        <Table.Th>{t("view.admin.table.username")}</Table.Th>
                        <Table.Th>{t("view.admin.table.role")}</Table.Th>
                        <Table.Th/>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {users.map((user, index) =>
                        <Table.Tr key={index}>
                            <Table.Td>
                                {user.id}
                            </Table.Td>

                            <Table.Td>
                                {user.username}
                            </Table.Td>

                            <Table.Td>
                                {user.role}
                            </Table.Td>

                            <Table.Td>
                                <Group justify={"end"}>
                                    <BsTrash
                                        size={20}
                                        className={"hover-pointer"}
                                        color={theme.colors.gray[7]}
                                        onClick={() => open(DialogType.REMOVE_SCORE, {
                                            id: user.id,
                                            username: user.username,
                                            onRemove: refresh
                                        })}
                                    />
                                </Group>
                            </Table.Td>
                        </Table.Tr>
                    )}
                </Table.Tbody>
            </Table>
            {!users.length &&
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

export default ScoreTable;
