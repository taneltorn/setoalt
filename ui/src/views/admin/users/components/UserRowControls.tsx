import React from "react";
import {useTranslation} from "react-i18next";
import {Group} from "@mantine/core";
import {useDialogContext} from "../../../../hooks/useDialogContext.tsx";
import {User} from "../../../../model/User.ts";
import {FaPencil, FaRegTrashCan} from "react-icons/fa6";
import {DialogType} from "../../../../utils/enums.ts";
import IconButton from "../../../../components/controls/IconButton.tsx";
import {Size} from "../../../../utils/constants.ts";
import {useAuth} from "../../../../hooks/useAuth.tsx";

interface Properties {
    user: User;
    onChange: () => void;
}

const UserRowControls: React.FC<Properties> = ({user, onChange}) => {

    const {t} = useTranslation();

    const auth = useAuth();
    const {open} = useDialogContext();

    return (
        <Group justify={"end"} gap={4}>
            <IconButton
                title={t("button.edit")}
                icon={<FaPencil size={Size.icon.XS}/>}
                onClick={() => open(DialogType.SAVE_USER, {
                    user: user,
                    onSave: onChange
                })}
            />

            <IconButton
                title={t("button.remove")}
                disabled={user.id === auth.currentUser?.id}
                icon={<FaRegTrashCan size={Size.icon.XS}/>}
                onClick={() => open(DialogType.REMOVE_USER, {
                    user: user,
                    onRemove: onChange
                })}
            />
        </Group>
    );
}

export default UserRowControls;
