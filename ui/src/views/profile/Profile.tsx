import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import Page from "../../Page.tsx";
import Header from "../../components/controls/Header.tsx";
import {useAuth} from "../../hooks/useAuth.tsx";
import {Button, Divider, Group, Input, TextInput, Title} from "@mantine/core";
import {useForm} from "react-hook-form";
import {User} from "../../model/User.ts";
import useUserService from "../../hooks/useUserService.tsx";
import ValueAndLabel from "../../components/ValueAndLabel.tsx";
import moment from "moment";
import {DateFormat} from "../../utils/constants.ts";

const DEFAULT_VALUES = {
    password: "",
}

const Profile: React.FC = () => {

    const {t} = useTranslation();
    const auth = useAuth();
    const userService = useUserService();

    const [user, setUser] = useState<User>();

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

    useEffect(() => {
        userService.fetchUserByUserName(auth.currentUser?.username || "")
            .then((data) => setUser(data));
    }, []);


    return (
        <Page title={t("view.profile.title")}>
            {user && <>
                <Header>{t("view.profile.title")}</Header>

                <ValueAndLabel label={t("view.profile.label.username")} value={user.username}/>
                <ValueAndLabel label={t("view.profile.label.name")} value={(`${user.firstname || ""} ${user.lastname || ""}`.trim()) || "N/A"}/>
                <ValueAndLabel label={t("view.profile.label.role")} value={t(`role.${user.role.toLowerCase()}`)}/>
                <ValueAndLabel label={t("view.profile.label.createdAt")}
                               value={moment(user.createdAt).format(DateFormat)}/>

                <Divider my={"md"}/>

                <Title order={4} mb={"md"}>{t("view.profile.form.changePassword")}</Title>

                {auth.currentUser?.id &&
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <Group>
                            <Input.Wrapper
                                size={"xl"}
                                mb={"md"}
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
            </>}
        </Page>
    );
}

export default Profile;
