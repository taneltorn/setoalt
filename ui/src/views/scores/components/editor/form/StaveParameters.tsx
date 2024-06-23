import React from 'react';
import {useTranslation} from "react-i18next";
import {
    Box,
    Group,
    Input,
    Slider,
    Text,
} from "@mantine/core";
import {Controller, useFieldArray, useFormContext} from "react-hook-form";
import {Layout, Playback} from "../../../../../utils/constants.ts";
import {Score} from "../../../../../models/Score.ts";


const StaveParameters: React.FC = () => {

    const {t} = useTranslation();
    const {control, formState: {errors}} = useFormContext<Score>();
    const {fields} = useFieldArray({
        control,
        name: "data.stave.lines",
    });

    return (
        <>

            <Input.Wrapper
                label={t("view.editor.form.defaultTransposition")}
                size={Layout.form.LABEL_SIZE}
                labelProps={Layout.form.LABEL_PROPS}
                error={errors.defaultTransposition?.message}
                mb={Layout.form.WRAPPER_BOTTOM_MARGIN}
            >
                <Controller
                    name="defaultTransposition"
                    control={control}
                    render={({field}) => (
                        <>
                            <Group justify={"end"}>
                                <Text fw={"bold"}>
                                    {field.value && field.value > 0 ? "+" : ""}{field.value || 0}
                                </Text>
                            </Group>
                            <Slider
                                size={Layout.form.SLIDER_SIZE}
                                color="gray"
                                label={null}
                                min={Playback.MIN_TRANSPOSE}
                                max={Playback.MAX_TRANSPOSE}
                                step={Playback.TRANSPOSE_SLIDER_STEP}
                                value={field.value || 0}
                                onChange={field.onChange}
                            />
                        </>
                    )}
                />
            </Input.Wrapper>

            <Input.Wrapper
                label={t("view.editor.form.lineDetuning")}
                size={Layout.form.LABEL_SIZE}
                labelProps={Layout.form.LABEL_PROPS}
                error={errors.defaultTempo?.message}
                mb={Layout.form.WRAPPER_BOTTOM_MARGIN}
            >
                {fields.map((line, index) =>
                    <Controller
                        name={`data.stave.lines.${index}.detune`}
                        control={control}
                        render={({field}) => (
                            <Box mb={"lg"}>
                                <Group justify={"space-between"}>
                                    <Text fw={"bold"}>
                                        {line.pitch.toUpperCase()}
                                    </Text>
                                    <Text fw={"bold"}>
                                        {field.value && field.value > 0 ? "+" : ""}{field.value || 0}
                                    </Text>
                                </Group>
                                <Slider
                                    size={Layout.form.SLIDER_SIZE}
                                    color="gray"
                                    label={null}
                                    min={Playback.MIN_DETUNE}
                                    max={Playback.MAX_DETUNE}
                                    step={Playback.DETUNE_SLIDER_STEP}
                                    value={field.value || 0}
                                    onChange={field.onChange}
                                />
                            </Box>
                        )}
                    />
                )}
            </Input.Wrapper>

            <Input.Wrapper
                label={t("view.editor.form.defaultTempo")}
                size={Layout.form.LABEL_SIZE}
                labelProps={Layout.form.LABEL_PROPS}
                error={errors.defaultTempo?.message}
                mb={Layout.form.WRAPPER_BOTTOM_MARGIN}
            >
                <Controller
                    name="defaultTempo"
                    control={control}
                    render={({field}) => (
                        <>
                            <Group justify={"end"}>
                                <Text fw={"bold"}>
                                    {field.value && field.value > 0 ? "+" : ""}{field.value || 0}
                                </Text>
                            </Group>
                            <Slider
                                size={Layout.form.SLIDER_SIZE}
                                color="gray"
                                label={null}
                                min={Playback.MIN_TEMPO}
                                max={Playback.MAX_TEMPO}
                                step={Playback.TEMPO_SLIDER_STEP}
                                value={field.value || 0}
                                onChange={field.onChange}
                            />
                        </>
                    )}
                />
            </Input.Wrapper>
        </>
    )
};

export default StaveParameters;
