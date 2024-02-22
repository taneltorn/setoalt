import {Button, Grid, Input, Title} from "@mantine/core";
import {useTranslation} from "react-i18next";
import React, {useEffect} from "react";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext.tsx";
import Page from "../Page.tsx";

type LoginFormValues = {
    username: string
    password: string
}

const Login: React.FC = () => {

    const {t} = useTranslation();

    const auth = useAuth();
    const navigate = useNavigate();
    const {register, handleSubmit} = useForm<LoginFormValues>();

    const onSubmit = async (values: LoginFormValues) => {
        auth.login(values.username, values.password)
            .then(response => {
                if (response) {
                    navigate("/")
                }
            });
    }

    useEffect(() => {
        if (auth.currentUser) {
            navigate("/");
        }
    }, []);

    return (
        <Page title={t("view.login.title")}>
            <Title order={1} mb={"xs"}>{t("view.login.title")}</Title>

            <Grid mb={"md"}>
                <Grid.Col span={4}>
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <Input
                            size={"lg"}
                            placeholder={t("view.login.form.username")}
                            {...register("username", {required: t("field.required")})}
                        />

                        <Input
                            size={"lg"}
                            placeholder={t("view.login.form.password")}
                            mt={"xs"}
                            type={"password"}
                            {...register("password", {required: t("field.required")})}
                        />

                        <Button mt={"md"} size={"lg"} type={"submit"}>
                            {t("button.submit")}
                        </Button>
                    </form>
                </Grid.Col>
            </Grid>
        </Page>
    );
}

export default Login;
