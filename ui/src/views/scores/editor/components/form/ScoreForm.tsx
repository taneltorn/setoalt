import React from 'react';
import {useScoreContext} from "../../../../../hooks/useScoreContext.tsx";
import {useTranslation} from "react-i18next";
import {
    Input,
    Switch, Text,
    Textarea,
    TextInput
} from "@mantine/core";
import {Controller, useFormContext} from "react-hook-form";
import {Score} from "../../../../../model/Score.ts";
import {Size} from "../../../../../utils/constants.ts";
import {useAuth} from "../../../../../hooks/useAuth.tsx";
import {Role} from "../../../../../utils/enums.ts";

interface Properties {
    onSubmit: (values: Score) => void;
}

const ScoreForm: React.FC<Properties> = ({onSubmit}) => {

    const [t] = useTranslation();
    const context = useScoreContext();
    const {register, handleSubmit, control, formState: {errors}} = useFormContext<Score>();
    const auth = useAuth();

    const handleFocus = {
        onFocus: () => context.setIsTypeMode(true),
        onBlur: () => context.setIsTypeMode(false)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Input.Wrapper
                label={t("view.editor.form.name")}
                size={"xl"}
                mb={"xl"}
                error={errors.name?.message}
            >
                <TextInput
                    size={"xl"}
                    placeholder={t("view.editor.form.name")}
                    {...register("name", {required: t("field.required")})}
                    {...handleFocus}
                />
            </Input.Wrapper>

            <Input.Wrapper
                label={t("view.editor.form.visibility")}
                size={"xl"}
                mb={"xl"}
                error={errors.visibility?.message}
            >
                <Controller
                    name="visibility"
                    control={control}
                    render={({field}) => (
                        <Switch
                            size={"lg"}
                            {...field}
                            disabled={auth.currentUser?.role === Role.USER}
                            label={t(`visibility.${field.value?.toLowerCase()}`)}
                            checked={field.value === "PUBLIC"}
                            onChange={(event) => field.onChange(event.currentTarget.checked ? "PUBLIC" : "PRIVATE")}
                        />
                    )}
                />
                <Text mt={"xs"}>
                    {t("view.editor.form.visibilityComment")}
                </Text>
            </Input.Wrapper>

            <Input.Wrapper
                label={t("view.editor.form.description")}
                size={"xl"}
                mb={"xl"}
                error={errors.description?.message}
            >
                <Textarea
                    size={"xl"}
                    autosize
                    minRows={4}
                    maxRows={12}
                    placeholder={t("view.editor.form.description")}
                    {...register("description")}
                    {...handleFocus}
                />
            </Input.Wrapper>

            <Input.Wrapper
                label={t("view.editor.form.recording")}
                size={"xl"}
                mb={"xl"}
                error={errors.recording?.message}
            >
                <TextInput
                    size={"xl"}
                    placeholder={t("view.editor.form.recording")}
                    {...register("recording")}
                    {...handleFocus}
                />
            </Input.Wrapper>

            <Input.Wrapper
                label={t("view.editor.form.text")}
                size={"xl"}
                error={errors.text?.message}
            >
                <Textarea
                    size={"xl"}
                    autosize
                    minRows={4}
                    maxRows={Size.icon.SM}
                    placeholder={t("view.editor.form.text")}
                    {...register("text")}
                    {...handleFocus}
                />
            </Input.Wrapper>
        </form>
    )
};

export default ScoreForm;
