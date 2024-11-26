import React from "react";
import {useTranslation} from "react-i18next";
import Page from "../../Page.tsx";
import Header from "../../components/controls/Header.tsx";
import {useAuth} from "../../hooks/useAuth.tsx";
import {Button, Group, Input, TextInput} from "@mantine/core";
import {useForm} from "react-hook-form";
import {User} from "../../model/User.ts";
import useUserService from "../../hooks/useUserService.tsx";

const DEFAULT_VALUES = {
    password: "",
}

const Profile: React.FC = () => {

    const {t} = useTranslation();
    const auth = useAuth();
    const userService = useUserService();

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<User>({defaultValues: DEFAULT_VALUES});

    const onSubmit = async (values: User) => {
        if (!auth.currentUser?.id) {
            return;
        }

        userService.updateUserPassword(auth.currentUser.id, values);
    }

    return (
        <Page title={t("view.profile.title")}>
            <Header>{auth.currentUser?.username}</Header>

            {auth.currentUser?.id &&
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Group>
                        <Input.Wrapper
                            label={t("view.profile.form.newPassword")}
                            size={"xl"}
                            mb={"xl"}
                            error={errors.password?.message}
                        >
                            <TextInput
                                size={"xl"}
                                type={"password"}
                                placeholder={t("view.profile.form.newPassword")}
                                {...register("username", {required: t("field.required")})}
                                autoComplete={"off"}
                            />
                        </Input.Wrapper>
                    </Group>
                    <Group>
                        <Button
                            size={"md"}
                            type={"submit"}
                            loading={userService.isLoading}
                        >
                            {t("button.save")}
                        </Button>
                    </Group>
                </form>}
        </Page>
    );
}

export default Profile;
