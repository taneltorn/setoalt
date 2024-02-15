import React, {useEffect} from 'react';
import Dialog from "./Dialog";
import {DialogType, useDialogContext} from "../../context/DialogContext";
import {useTranslation} from "react-i18next";
import {Box, Button, Grid, Group, InputWrapper, Switch, TextInput} from "@mantine/core";
import {Controller, useForm} from 'react-hook-form';
import {Layout} from "../../utils/constants.ts";
import {Role} from "../../context/AuthContext.tsx";
import {User} from "../../models/User.ts";
import useUserService from "../../services/UserService.tsx";
import {DisplayError, DisplaySuccess} from "../../utils/helpers.tsx";

const DEFAULT_VALUES = {
    username: "",
    password: "",
    role: Role.EDITOR
}


const SaveUserDialog: React.FC = () => {

    const [t] = useTranslation();
    const {close, context} = useDialogContext();
    const userService = useUserService();

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
        const saveUser = () => context.id ? userService.updateUser(context.id, values) : userService.createUser(values);
        saveUser()
            .then(() => {
                DisplaySuccess(t("toast.success.title"), t("toast.success.saveUser"))
                handleClose();
                context.onSave && context.onSave();
            })
            .catch(() => DisplayError(t("toast.error.title"), t("toast.error.saveUser")));
    }

    const handleClose = () => {
        close();
        reset();
    }

    useEffect(() => {
        if (context.id) {
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
            title={t("dialog.saveUser.title")}
            hidePrimaryButton
            hideSecondaryButton
            onClose={handleClose}
        >
            <Box style={{width: 700}}>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    {!context.id && <>
                        <Grid>
                            <Grid.Col>
                                <InputWrapper size={"lg"} labelProps={Layout.form.LABEL_PROPS}
                                              label={t("view.admin.form.username")}>
                                    <TextInput
                                        size={"xl"}
                                        placeholder={t("view.admin.form.username")}
                                        {...register("username", {required: t("field.required")})}
                                        error={errors.username?.message}
                                    />
                                </InputWrapper>
                            </Grid.Col>
                        </Grid>
                        <Grid mt={"md"}>
                            <Grid.Col>
                                <InputWrapper size={"lg"} labelProps={Layout.form.LABEL_PROPS}
                                              label={t("view.admin.form.password")}>
                                    <TextInput
                                        size={"xl"}
                                        type={"password"}
                                        placeholder={t("view.admin.form.password")}
                                        {...register("password", {required: t("field.required")})}
                                        error={errors.password?.message}
                                    />
                                </InputWrapper>
                            </Grid.Col>
                        </Grid>
                    </>}

                    <Grid>
                        <Grid.Col>
                            <InputWrapper size={"lg"} labelProps={Layout.form.LABEL_PROPS}
                                          label={t("view.admin.form.firstname")}>
                                <TextInput
                                    size={"xl"}
                                    placeholder={t("view.admin.form.firstname")}
                                    {...register("firstname", {required: t("field.required")})}
                                    error={errors.username?.message}
                                />
                            </InputWrapper>
                        </Grid.Col>
                    </Grid>
                    <Grid>
                        <Grid.Col>
                            <InputWrapper size={"lg"} labelProps={Layout.form.LABEL_PROPS}
                                          label={t("view.admin.form.lastname")}>
                                <TextInput
                                    size={"xl"}
                                    placeholder={t("view.admin.form.lastname")}
                                    {...register("lastname")}
                                />
                            </InputWrapper>
                        </Grid.Col>
                    </Grid>

                    <Grid mt={"md"}>
                        <Grid.Col>
                            <InputWrapper size={"lg"} labelProps={Layout.form.LABEL_PROPS}
                                          label={t("view.admin.form.role")}>
                                <Controller
                                    name="role"
                                    control={control}
                                    render={({field}) => (
                                        <Switch
                                            size={"lg"}
                                            {...field}
                                            disabled={false}
                                            label={t(`view.admin.form.${field.value?.toLowerCase()}`)}
                                            checked={field.value === Role.EDITOR}
                                            onChange={(event) => field.onChange(event.currentTarget.checked ? Role.EDITOR : Role.USER)}
                                        />
                                    )}
                                />
                            </InputWrapper>
                        </Grid.Col>
                    </Grid>

                    <Group justify={"end"}>
                        <Button mt={"md"} size={"lg"} variant={"light"} color={"gray.9"}
                                onClick={handleClose}>
                            {t("button.cancel")}
                        </Button>
                        <Button mt={"md"} size={"lg"} type={"submit"}>
                            {t("button.save")}
                        </Button>
                    </Group>

                </form>
            </Box>
        </Dialog>
    )
};

export default SaveUserDialog;
