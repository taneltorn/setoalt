import React from 'react';
import {useScoreContext} from "../../../../../context/ScoreContext.tsx";
import {useTranslation} from "react-i18next";
import {
    Group,
    Input,
    Slider,
    Switch,
    Textarea,
    TextInput
} from "@mantine/core";
import {Controller, useFormContext} from "react-hook-form";
import {Layout, Playback} from "../../../../../utils/constants.ts";
import {Score} from "../../../../../models/Score.ts";

interface Properties {
    onSubmit: (values: Score) => void;
}

const ScoreForm: React.FC<Properties> = ({onSubmit}) => {

    const [t] = useTranslation();
    const context = useScoreContext();
    const {register, handleSubmit, control, formState: {errors}} = useFormContext<Score>();

    const handleFocus = {
        onFocus: () => context.setIsTyping(true),
        onBlur: () => context.setIsTyping(false)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>

            <Input.Wrapper
                label={t("view.editor.form.name")}
                size={"lg"} labelProps={Layout.form.LABEL_PROPS}
                error={errors.name?.message}
                mb={"lg"}
            >
                <TextInput
                    size={"xl"}
                    placeholder={t("view.editor.form.name")}
                    {...register("name", {required: t("field.required")})}
                    {...handleFocus}

                />
            </Input.Wrapper>

            <Group mb={"lg"}>
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
            </Group>

            <Input.Wrapper
                label={t("view.editor.form.description")}
                size={"lg"} labelProps={Layout.form.LABEL_PROPS}
                error={errors.description?.message}
                mt={"xl"}
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
                label={t("view.editor.form.defaultTempo")}
                size={"lg"} labelProps={Layout.form.LABEL_PROPS}
                error={errors.defaultTempo?.message}
                mt={"xl"}
            >
                <Controller
                    name="defaultTempo"
                    control={control}
                    render={({field}) => (
                        <Slider
                            size={"xl"}
                            mt={"md"}
                            min={Playback.MIN_TEMPO}
                            max={Playback.MAX_TEMPO}
                            value={field.value}
                            onChange={field.onChange}
                        />
                    )}
                />
            </Input.Wrapper>

            <Input.Wrapper
                label={t("view.editor.form.text")}
                size={"lg"} labelProps={Layout.form.LABEL_PROPS}
                error={errors.text?.message}
                mt={"xl"}
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
