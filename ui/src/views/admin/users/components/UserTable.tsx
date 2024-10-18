import React from "react";
import {useTranslation} from "react-i18next";
import {Badge, useMantineTheme} from "@mantine/core";
import useUserService from "../../../../hooks/useUserService.tsx";
import {User} from "../../../../model/User.ts";
import {Role} from "../../../../utils/enums.ts";
import {DateFormat} from "../../../../utils/constants.ts";
import DataTable from "../../../../components/table/DataTable.tsx";
import {Row} from "../../../../model/Row.ts";
import UserListControls from "./UserControls.tsx";
import moment from "moment";

interface Properties {
    users: User[];
    onChange: () => void;
}

const UserTable: React.FC<Properties> = ({users, onChange}) => {

    const {t} = useTranslation();
    const theme = useMantineTheme();

    const userService = useUserService();

    return (
        <DataTable
            isLoading={userService.isLoading}
            headers={[
                t("view.admin.users.table.id"),
                t("view.admin.users.table.username"),
                t("view.admin.users.table.name"),
                t("view.admin.users.table.role"),
                t("view.admin.users.table.createdAt"),
            ]}
            rows={users.map(user => ({
                name: user.username,
                data: [
                    user.id,
                    user.username,
                    `${user.firstname || ""} ${user.lastname || ""}`,
                    <Badge
                        bg={[Role.ADMIN, Role.EDITOR].includes(user.role) ? theme.primaryColor : theme.colors.gray[4]}>
                        {t(`role.${user.role.toLowerCase()}`)}
                    </Badge>,
                    moment(user.createdAt).format(DateFormat),
                    <UserListControls user={user} onChange={onChange}/>
                ]
            }) as Row)}
        />
    );
}

export default UserTable;
