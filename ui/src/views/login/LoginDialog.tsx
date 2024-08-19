import {Input} from "@mantine/core";
import {useTranslation} from "react-i18next";
import React from "react";
import {useForm} from "react-hook-form";
import {useAuth} from "../../hooks/useAuth.tsx";
import {DialogType} from "../../utils/enums.ts";
import Dialog from "../../components/dialog/Dialog.tsx";
import {useDialogContext} from "../../hooks/useDialogContext.tsx";

type LoginFormValues = {
    username: string
    password: string
}

const LoginDialog: React.FC = () => {

    const {t} = useTranslation();

    const auth = useAuth();
    const {close} = useDialogContext();
    const {register, handleSubmit} = useForm<LoginFormValues>();

    const onSubmit = async (values: LoginFormValues) => {
        auth.login(values.username, values.password)
            .then(response => {
                if (response) {
                    close();
                }
            });
    }

    return (
        <Dialog
            size={"sm"}
            type={DialogType.LOGIN}
            title={t("view.login.title")}
            onPrimaryButtonClick={handleSubmit(onSubmit)}
            primaryButtonLabel={t("view.login.form.submit")}
            hideSecondaryButton
            onClose={close}
        >
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Input
                    placeholder={t("view.login.form.username")}
                    size={"xl"}
                    mb={"md"}
                    {...register("username", {required: t("field.required")})}
                />

                <Input
                    placeholder={t("view.login.form.password")}
                    size={"xl"}
                    type={"password"}
                    {...register("password", {required: t("field.required")})}
                />
            </form>
        </Dialog>
    );
}

export default LoginDialog;
