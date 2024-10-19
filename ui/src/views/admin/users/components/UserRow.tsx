import React from "react";
import {useTranslation} from "react-i18next";
import {Badge, Table, useMantineTheme} from "@mantine/core";
import {User} from "../../../../model/User.ts";
import {Role} from "../../../../utils/enums.ts";
import {DateFormat} from "../../../../utils/constants.ts";
import UserListControls from "./UserControls.tsx";
import moment from "moment";

interface Properties {
    user: User;
    onChange: () => void;
}

const UserRow: React.FC<Properties> = ({user, onChange}) => {

    const {t} = useTranslation();
    const theme = useMantineTheme();

    return (
        <Table.Tr>
            <Table.Td>{user.id}</Table.Td>
            <Table.Td>{user.username}</Table.Td>
            <Table.Td>{`${user.firstname || ""} ${user.lastname || ""}`}</Table.Td>
            <Table.Td>
                <Badge
                    bg={[Role.ADMIN, Role.EDITOR].includes(user.role) ? theme.primaryColor : theme.colors.gray[4]}>
                    {t(`role.${user.role.toLowerCase()}`)}
                </Badge>
            </Table.Td>
            <Table.Td>{moment(user.createdAt).format(DateFormat)}</Table.Td>
            <Table.Td>
                <UserListControls user={user} onChange={onChange}/>
            </Table.Td>
        </Table.Tr>
    );
}

export default UserRow;
