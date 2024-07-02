import React from 'react';
import {useScoreContext} from "../../../../../hooks/useScoreContext.tsx";
import {useTranslation} from "react-i18next";
import {
    Input,
    Switch,
    Textarea,
    TextInput
} from "@mantine/core";
import {Controller, useFormContext} from "react-hook-form";
import {Score} from "../../../../../model/Score.ts";
import {Size} from "../../../../../utils/constants.ts";

interface Properties {
    onSubmit: (values: Score) => void;
}

const ScoreForm: React.FC<Properties> = ({onSubmit}) => {

    const [t] = useTranslation();
    const context = useScoreContext();
    const {register, handleSubmit, control, formState: {errors}} = useFormContext<Score>();

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
                            size={"xl"}
                            {...field}
                            disabled={false}
                            label={t(`visibility.${field.value?.toLowerCase()}`)}
                            checked={field.value === "PUBLIC"}
                            onChange={(event) => field.onChange(event.currentTarget.checked ? "PUBLIC" : "PRIVATE")}
                        />
                    )}
                />
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
