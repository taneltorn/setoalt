import React, {useEffect} from 'react';
import Dialog from "../../../../components/dialog/Dialog.tsx";
import {useDialogContext} from "../../../../hooks/useDialogContext.tsx";
import {useTranslation} from "react-i18next";
import {Input, Radio, TextInput} from "@mantine/core";
import {Controller, useForm} from 'react-hook-form';
import {DialogType, Role} from "../../../../utils/enums.ts";
import {User} from "../../../../model/User.ts";
import useUserService from "../../../../hooks/useUserService.tsx";
import {useAuth} from "../../../../hooks/useAuth.tsx";

const DEFAULT_VALUES = {
    username: "",
    password: "",
    role: Role.USER
}

const SaveUserDialog: React.FC = () => {

    const [t] = useTranslation();

    const {close, context} = useDialogContext();
    const userService = useUserService();
    const auth = useAuth();

    const {
        register,
        control,
        reset,
        setValue,
        unregister,
        handleSubmit,
        formState: {errors}
    } = useForm<User>({defaultValues: DEFAULT_VALUES});

    const onSubmit = async (values: User) => {
        const saveUser = () => context.user?.id
            ? userService.updateUser(context.user.id, values)
            : userService.createUser(values);

        saveUser()
            .then(() => {
                context.onSave && context.onSave();
                handleClose();
            });
    }

    const handleClose = () => {
        close();
        reset();
    }

    useEffect(() => {
        if (context.user) {
            setValue("firstname", context.user?.firstname || "");
            setValue("lastname", context.user?.lastname || "");
            setValue("role", context.user?.role || "");
            unregister("username");
            unregister("password");
        }
    }, [context]);

    return (
        <Dialog
            type={DialogType.SAVE_USER}
            size={"lg"}
            title={t("dialog.saveUser.title")}
            onPrimaryButtonClick={handleSubmit(onSubmit)}
            onSecondaryButtonClick={handleClose}
            onClose={handleClose}
        >
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                {!context.user?.id && <>
                    <Input.Wrapper
                        label={t("view.admin.users.form.username")}
                        size={"xl"}
                        mb={"xl"}
                        error={errors.username?.message}
                    >
                        <TextInput
                            size={"xl"}
                            placeholder={t("view.admin.users.form.username")}
                            {...register("username", {required: t("field.required")})}
                            autoComplete={"new-password"}
                        />
                    </Input.Wrapper>

                    <Input.Wrapper
                        label={t("view.admin.users.form.password")}
                        size={"xl"}
                        mb={"xl"}
                        error={errors.password?.message}
                    >
                        <TextInput
                            size={"xl"}
                            placeholder={t("view.admin.users.form.password")}
                            {...register("password", {required: t("field.required")})}
                            autoComplete={"new-password"}
                        />
                    </Input.Wrapper>
                </>}

                <Input.Wrapper
                    label={t("view.admin.users.form.firstname")}
                    size={"xl"}
                    mb={"xl"}
                    error={errors.firstname?.message}
                >
                    <TextInput
                        size={"xl"}
                        placeholder={t("view.admin.users.form.firstname")}
                        {...register("firstname")}
                    />
                </Input.Wrapper>

                <Input.Wrapper
                    label={t("view.admin.users.form.lastname")}
                    size={"xl"}
                    mb={"xl"}
                    error={errors.lastname?.message}
                >
                    <TextInput
                        size={"xl"}
                        placeholder={t("view.admin.users.form.lastname")}
                        {...register("lastname")}
                    />
                </Input.Wrapper>

                {!(auth.currentUser?.id === context?.user?.id) &&
                    <Input.Wrapper
                        label={t("view.admin.users.form.role")}
                        size={"xl"}
                        mb={"xl"}
                        error={errors.role?.message}
                    >
                        <Controller
                            name="role"
                            control={control}
                            render={({field}) => (
                                <Radio.Group
                                    {...field}
                                    value={field.value}
                                    onChange={field.onChange}
                                >
                                    <Radio
                                        size={"md"}
                                        mb={"md"}
                                        value={Role.USER}
                                        label={t("role.user")}
                                    />
                                    <Radio
                                        size={"md"}
                                        mb={"md"}
                                        value={Role.EDITOR}
                                        label={t("role.editor")}
                                    />
                                    <Radio
                                        size={"md"}
                                        mb={"md"}
                                        value={Role.ADMIN}
                                        label={t("role.admin")}
                                    />
                                </Radio.Group>
                            )}
                        />
                    </Input.Wrapper>}
            </form>
        </Dialog>
    )
};

export default SaveUserDialog;
