import React, {useEffect} from 'react';
import Dialog from "../../../components/dialog/Dialog.tsx";
import {useDialogContext} from "../../../hooks/useDialogContext.tsx";
import {useTranslation} from "react-i18next";
import {Input, Textarea, TextInput} from "@mantine/core";
import {Controller, useForm} from 'react-hook-form';
import {dayEnd, dayStart, DisplayError, DisplaySuccess} from "../../../utils/helpers.tsx";
import useNotificationService from "../../../hooks/useNotificationService.tsx";
import {Notification} from "../../../model/Notification.ts";
import {DatePickerInput} from "@mantine/dates";
import {DialogType} from "../../../utils/enums.ts";
import "dayjs/locale/et.js";

const DEFAULT_VALUES = {
    message: "",
    type: "",
}

const SaveNotificationsDialog: React.FC = () => {

    const [t] = useTranslation();
    const {close, context} = useDialogContext();
    const notificationService = useNotificationService();

    const {
        register,
        control,
        reset,
        setValue,
        handleSubmit,
        formState: {errors}
    } = useForm<Notification>({defaultValues: DEFAULT_VALUES});


    const onSubmit = async (values: Notification) => {
        const saveNotification = () => context.notification?.id
            ? notificationService.updateNotification(context.notification.id, values)
            : notificationService.createNotification(values);
        saveNotification()
            .then(() => {
                DisplaySuccess(t("toast.success.saveNotification"))
                context.onSave && context.onSave();
                handleClose();
            })
            .catch(() => DisplayError(t("toast.error.saveNotification")));
    }

    const handleClose = () => {
        close();
        reset();
    }

    useEffect(() => {
        if (context.notification) {
            setValue("title", context.notification.title || "");
            setValue("message", context.notification.message || "");
            setValue("validFrom", context.notification.validFrom ? new Date(context.notification.validFrom) : null);
            setValue("validTo", context.notification.validTo ? new Date(context.notification.validTo) : null);
        }
    }, [context]);

    return (
        <Dialog
            type={DialogType.SAVE_NOTIFICATION}
            size={"lg"}
            title={t("dialog.saveNotification.title")}
            onPrimaryButtonClick={handleSubmit(onSubmit)}
            onSecondaryButtonClick={handleClose}
            onClose={handleClose}
        >
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Input.Wrapper
                    label={t("view.admin.notifications.title")}
                    size={"xl"}
                    mb={"xl"}
                    error={errors.title?.message}
                >
                    <TextInput
                        size={"xl"}
                        placeholder={t("view.admin.notifications.title")}
                        {...register("title", {required: t("field.required")})}
                    />
                </Input.Wrapper>

                <Input.Wrapper
                    label={t("view.admin.notifications.message")}
                    size={"xl"}
                    mb={"xl"}
                    error={errors.message?.message}
                >
                    <Textarea
                        size={"xl"}
                        autosize
                        minRows={4}
                        maxRows={12}
                        placeholder={t("view.admin.notifications.message")}
                        {...register("message", {required: t("field.required")})}
                    />
                </Input.Wrapper>

                <Input.Wrapper
                    label={t('view.admin.notifications.validFrom')}
                    size={'xl'}
                    mb={'xl'}
                    error={errors.validFrom?.message}
                >
                    <Controller
                        name="validFrom"
                        control={control}
                        render={({field}) => (
                            <DatePickerInput
                                size={'xl'}
                                locale={"et"}
                                valueFormat={"DD.MM.YYYY"}
                                placeholder={t("view.admin.notifications.date")}
                                clearable
                                {...field}
                                onChange={v => field.onChange(dayStart(v))}
                            />
                        )}
                    />
                </Input.Wrapper>

                <Input.Wrapper
                    label={t('view.admin.notifications.validTo')}
                    size={'xl'}
                    mb={'xl'}
                    error={errors.validTo?.message}
                >
                    <Controller
                        name="validTo"
                        control={control}
                        render={({field}) => (
                            <DatePickerInput
                                size={'xl'}
                                locale={"et"}
                                valueFormat={"DD.MM.YYYY"}
                                placeholder={t("view.admin.notifications.date")}
                                clearable
                                {...field}
                                onChange={v => field.onChange(dayEnd(v))}
                            />
                        )}
                    />
                </Input.Wrapper>
            </form>
        </Dialog>
    )
};

export default SaveNotificationsDialog;
