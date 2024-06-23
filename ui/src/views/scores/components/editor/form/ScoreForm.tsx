import React from 'react';
import {useScoreContext} from "../../../../../context/ScoreContext.tsx";
import {useTranslation} from "react-i18next";
import {
    Input,
    Switch,
    Textarea,
    TextInput
} from "@mantine/core";
import {Controller, useFormContext} from "react-hook-form";
import {Layout} from "../../../../../utils/constants.ts";
import {Score} from "../../../../../model/Score.ts";

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
                size={Layout.form.LABEL_SIZE}
                labelProps={Layout.form.LABEL_PROPS}
                error={errors.name?.message}
                mb={Layout.form.WRAPPER_BOTTOM_MARGIN}
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
                size={Layout.form.LABEL_SIZE}
                labelProps={Layout.form.LABEL_PROPS}
                error={errors.visibility?.message}
                mb={Layout.form.WRAPPER_BOTTOM_MARGIN}
            >
                <Controller
                    name="visibility"
                    control={control}
                    render={({field}) => (
                        <Switch
                            size={"lg"}
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
                size={Layout.form.LABEL_SIZE}
                labelProps={Layout.form.LABEL_PROPS}
                error={errors.description?.message}
                mb={Layout.form.WRAPPER_BOTTOM_MARGIN}
            >
                <Textarea
                    size={"xl"}
                    autosize
                    minRows={2}
                    maxRows={8}
                    placeholder={t("view.editor.form.description")}
                    {...register("description")}
                    {...handleFocus}
                />
            </Input.Wrapper>

            <Input.Wrapper
                label={t("view.editor.form.text")}
                size={Layout.form.LABEL_SIZE}
                labelProps={Layout.form.LABEL_PROPS}
                error={errors.text?.message}
                mb={Layout.form.WRAPPER_BOTTOM_MARGIN}
            >
                <Textarea
                    size={"xl"}
                    autosize
                    minRows={6}
                    maxRows={20}
                    placeholder={t("view.editor.form.text")}
                    {...register("text")}
                    {...handleFocus}
                />
            </Input.Wrapper>
        </form>
    )
};

export default ScoreForm;
