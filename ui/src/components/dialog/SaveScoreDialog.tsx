import React from 'react';
import Dialog from "./Dialog";
import {DialogType, useDialogContext} from "../../context/DialogContext";
import {useTranslation} from "react-i18next";
import {Box, Button, Grid, Group, InputWrapper, Slider, Switch, Textarea, TextInput} from "@mantine/core";
import { useScoreContext } from '../../context/ScoreContext.tsx';
import useScoreService from '../../services/ScoreService.tsx';
import {Controller, useForm} from 'react-hook-form';
import {Playback} from "../../utils/constants.ts";
import {Score} from "../../models/Score.ts";
import {DisplayError, DisplaySuccess} from "../../utils/helpers.tsx";
import {useNavigate} from "react-router-dom";

const DEFAULT_VALUES = {
    name: "",
    description: "",
    defaultTempo: Playback.DEFAULT_TEMPO,
    visibility: "PUBLIC",
}

const SaveScoreDialog: React.FC = () => {

    const [t] = useTranslation();
    const context = useScoreContext();
    const {close} = useDialogContext();
    const scoreService = useScoreService();
    const navigate = useNavigate();

    const {
        register,
        control,
        handleSubmit,
        formState: {errors}
    } = useForm<Score>({defaultValues: DEFAULT_VALUES});

    const onSubmit = async (values: Score) => {
        const score = {...values, data: context.score.data};
        const saveScore = () => score.id ? scoreService.updateScore(score.id, score) : scoreService.createScore(score);
        saveScore()
            .then(() => {
                DisplaySuccess(t("toast.success.title"), t("toast.success.saveScore"))
                close();
                navigate("/scores");
            })
            .catch(() => DisplayError(t("toast.error.title"), t("toast.error.saveScore")));
    }

    const handleFocus = {
        onFocus: () => context.setIsTyping(true),
        onBlur: () => context.setIsTyping(false)
    }

    return (
        <Dialog
            type={DialogType.SAVE_SCORE}
            title={t("dialog.saveScore.title")}
            hidePrimaryButton
            hideSecondaryButton
            onClose={close}
        >
            <Box style={{width: 700}}>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Grid>
                        <Grid.Col>
                            <TextInput
                                size={"xl"}
                                placeholder={t("view.editor.form.name")}
                                {...register("name", {required: t("field.required")})}
                                error={errors.name?.message}
                                {...handleFocus}
                            />
                        </Grid.Col>
                    </Grid>
                    <Grid mt={"md"}>
                        <Grid.Col>
                            <Controller
                                name="visibility"
                                control={control}
                                render={({field}) => (
                                    <Switch
                                        size={"lg"}
                                        {...field}
                                        disabled={false}
                                        label={t("view.editor.form.visibility")}
                                        checked={field.value === "PUBLIC"}
                                        onChange={(event) => field.onChange(event.currentTarget.checked ? "PUBLIC" : "PRIVATE")}
                                    />
                                )}
                            />
                        </Grid.Col>
                    </Grid>


                    <Grid mt={"md"}>
                        <Grid.Col>
                            <Textarea
                                size={"xl"}
                                autosize
                                minRows={6}
                                maxRows={10}
                                placeholder={t("view.editor.form.description")}
                                {...register("description")}
                                {...handleFocus}
                            />
                        </Grid.Col>
                    </Grid>

                    <Grid mt={"lg"}>
                        <Grid.Col>
                            <InputWrapper size={"xl"} label={t("view.editor.form.defaultTempo")}>
                                <Controller
                                    name="defaultTempo"
                                    control={control}
                                    render={({field}) => (
                                        <Slider
                                            size={"xl"}
                                            min={Playback.MIN_TEMPO}
                                            max={Playback.MAX_TEMPO}
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </InputWrapper>
                        </Grid.Col>
                    </Grid>

                    <Grid mt={"md"}>
                        <Grid.Col>
                            <Textarea
                                size={"xl"}
                                autosize
                                minRows={6}
                                maxRows={10}
                                placeholder={t("view.editor.form.text")}
                                {...register("text")}
                                {...handleFocus}
                            />
                        </Grid.Col>
                    </Grid>

                    <Group justify={"end"}>
                        <Button mt={"md"} size={"lg"} variant={"light"} color={"gray.9"}
                                onClick={close}>
                            {t("button.cancel")}
                        </Button>
                        <Button mt={"md"} size={"lg"} type={"submit"}>
                            {t("button.save")}
                        </Button>
                    </Group>

                </form>
            </Box>
        </Dialog>
    )
};

export default SaveScoreDialog;
