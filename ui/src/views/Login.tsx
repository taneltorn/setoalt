import {Button, Grid, Input, Title} from "@mantine/core";
import {useTranslation} from "react-i18next";
import React, {useEffect} from "react";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext.tsx";

type FormValues = {
    username: string
    password: string
}

const Login: React.FC = () => {

    const {t} = useTranslation();

    const auth = useAuth();
    const navigate = useNavigate();
    const {register, handleSubmit} = useForm<FormValues>();

    const onSubmit = async (values: FormValues) => {
        auth.login(values.username, values.password)
            .then(response => {
                if (response.ok) {
                    navigate("/")
                }
            });
    }

    useEffect(() => {
        console.log("auth")
        console.log(auth.currentUser)
        if (auth.currentUser) {
            navigate("/");
        }
    }, []);

    return (
        <>
            <Title order={1} mb={"xs"}>{t("view.login.title")}</Title>

            <Grid mb={"md"}>
                <Grid.Col span={4}>
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <Input
                            value={"admin"} // todo remove
                            size={"lg"}
                            placeholder={t("field.username")}
                            {...register("username", {required: t("field.required")})}
                        />

                        <Input
                            value={"adminsetoalt"} // todo remove
                            size={"lg"}
                            placeholder={t("field.password")}
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
        </>
    );
}

export default Login;
