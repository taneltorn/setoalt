import React from "react";
import {useTranslation} from "react-i18next";
import {Group} from "@mantine/core";
import {useDialogContext} from "../../../../hooks/useDialogContext.tsx";
import {FaPencil, FaRegTrashCan} from "react-icons/fa6";
import IconButton from "../../../../components/controls/IconButton.tsx";
import {Size} from "../../../../utils/constants.ts";
import {Notification} from "../../../../model/Notification.ts";
import {DialogType} from "../../../../utils/enums.ts";

interface Properties {
    notification: Notification;
    onChange: () => void;
}

const NotificationRowControls: React.FC<Properties> = ({notification, onChange}) => {

    const {t} = useTranslation();

    const {open} = useDialogContext();

    return (
        <Group justify={"end"} gap={4}>
            <IconButton
                title={t("button.edit")}
                icon={<FaPencil size={Size.icon.XS}/>}
                onClick={() => open(DialogType.SAVE_NOTIFICATION, {
                    notification: notification,
                    onSave: onChange
                })}
            />

            <IconButton
                title={t("button.remove")}
                icon={<FaRegTrashCan size={Size.icon.XS}/>}
                onClick={() => open(DialogType.REMOVE_NOTIFICATION, {
                    notification: notification,
                    onRemove: onChange
                })}
            />
        </Group>
    );
}

export default NotificationRowControls;
