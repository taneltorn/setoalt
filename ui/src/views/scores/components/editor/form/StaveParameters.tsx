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
import {Playback, Size} from "../../../../../utils/constants.ts";
import {Score} from "../../../../../model/Score.ts";
import {RxReset} from "react-icons/rx";


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
                size={"xl"}
                mb={60}
                error={errors.defaultTransposition?.message}
            >
                <Controller
                    name="defaultTransposition"
                    control={control}
                    render={({field}) => (
                        <>
                            <Group justify={"end"}>
                                {field.value && field.value !== Playback.DEFAULT_TRANSPOSITION &&
                                    <RxReset
                                        size={Size.icon.SM}
                                        title={t("button.reset")}
                                        onClick={() => field.onChange(Playback.DEFAULT_TRANSPOSITION)}
                                        style={{cursor: "pointer"}}
                                    />}
                                <Text fw={"bold"}>
                                    {field.value && field.value > 0 ? "+" : ""}{field.value || 0}
                                </Text>
                            </Group>
                            <Slider
                                size={"lg"}
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
                label={t("view.editor.form.lineDetune")}
                size={"xl"}
                mb={60}
                error={errors.defaultTempo?.message}
            >
                {fields.map((line, index) =>
                    <Controller
                        key={index}
                        name={`data.stave.lines.${index}.detune`}
                        control={control}
                        render={({field}) => (
                            <Box mb={"lg"}>
                                <Group justify={"space-between"}>
                                    <Text fw={"bold"}>
                                        {line.pitch.toUpperCase()}
                                    </Text>
                                    <Group justify={"space-between"}>
                                        {field.value &&
                                            <RxReset
                                                title={t("button.reset")}
                                                size={Size.icon.SM}
                                                onClick={() => field.onChange(0)}
                                                style={{cursor: "pointer"}}
                                            />}
                                        <Text fw={"bold"}>
                                            {field.value && field.value > 0 ? "+" : ""}{field.value || 0}
                                        </Text>
                                    </Group>
                                </Group>
                                <Slider
                                    display={"flex"}
                                    size={"lg"}
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
                size={"xl"}
                error={errors.defaultTempo?.message}
            >
                <Controller
                    name="defaultTempo"
                    control={control}
                    render={({field}) => (
                        <>
                            <Group justify={"end"}>
                                {field.value !== Playback.DEFAULT_TEMPO &&
                                    <RxReset
                                        size={Size.icon.SM}
                                        title={t("button.reset")}
                                        onClick={() => field.onChange(Playback.DEFAULT_TEMPO)}
                                        style={{cursor: "pointer"}}
                                    />}
                                <Text fw={"bold"}>
                                    {field.value || 0}
                                </Text>
                            </Group>
                            <Slider
                                size={"lg"}
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
