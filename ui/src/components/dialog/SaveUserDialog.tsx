import React from 'react';
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
        handleSubmit,
        formState: {errors}
    } = useForm<User>({defaultValues: DEFAULT_VALUES});

    const onSubmit = async (values: User) => {
        console.log(values);

        userService.createUser(values)
            .then(() => {
                DisplaySuccess(t("toast.success.title"), t("toast.success.saveUser"))
                close();
                context.onSave && context.onSave();
                reset(DEFAULT_VALUES);
            })
            .catch(() => DisplayError(t("toast.error.title"), t("toast.error.saveUser")));
    }

    return (
        <Dialog
            type={DialogType.SAVE_USER}
            title={t("dialog.saveUser.title")}
            hidePrimaryButton
            hideSecondaryButton
            onClose={close}
        >
            <Box style={{width: 700}}>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
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
                                    placeholder={t("view.admin.form.password")}
                                    {...register("password", {required: t("field.required")})}
                                    error={errors.password?.message}
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
                                onClick={close}>
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
