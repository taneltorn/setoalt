import React from 'react';
import {useScoreContext} from "../../../../context/ScoreContext.tsx";
import {useTranslation} from "react-i18next";
import {
    Button,
    Grid,
    Group,
    InputWrapper,
    Slider,
    Switch,
    Textarea,
    TextInput, Title,
} from "@mantine/core";
import {Controller, useForm} from "react-hook-form";
import useScoreService from "../../../../services/ScoreService.tsx";
import {DisplayError, DisplaySuccess} from "../../../../utils/helpers.tsx";
import {Layout, Playback} from "../../../../utils/constants.ts";
import {Score} from "../../../../models/Score.ts";
import {Link, useNavigate} from "react-router-dom";
import {IoChevronBack} from "react-icons/io5";
import ScorePlaybackPanel from "../common/playback/ScorePlaybackPanel.tsx";
import Stave from "../common/stave/Stave.tsx";
import Page from "../../../../Page.tsx";
import ScoreEditorPanel from "../editor/ScoreEditorPanel.tsx";

const DEFAULT_VALUES = {
    name: "",
    description: "",
    defaultTempo: Playback.DEFAULT_TEMPO,
    visibility: "PUBLIC",
}

interface Properties {
    score: Score;
}

const ScoreForm: React.FC<Properties> = ({score}) => {

    const [t] = useTranslation();
    const context = useScoreContext();
    const scoreService = useScoreService();
    const navigate = useNavigate();

    const {
        register,
        control,
        handleSubmit,
        formState: {errors}
    } = useForm<Score>({defaultValues: {...score || DEFAULT_VALUES}});

    const onSubmit = async (values: Score) => {
        const score = {...values, data: context.score.data};
        score.data.voices.forEach(v => v.hidden = false);
        const saveScore = () => score.id ? scoreService.updateScore(score.id, score) : scoreService.createScore(score);
        saveScore()
            .then(() => {
                DisplaySuccess(t("toast.success.title"), t("toast.success.saveScore"));
                navigate(`/scores/${score.id}`);
            })
            .catch(() => DisplayError(t("toast.error.title"), t("toast.error.saveScore")));
    }

    const handleFocus = {
        onFocus: () => context.setIsTyping(true),
        onBlur: () => context.setIsTyping(false)
    }

    return (
        <Page title={t("view.editor.title")}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Group justify={"space-between"}>
                    <Group gap={"xs"}>
                        <Link to={`/scores/${score?.id}`} style={{display: "flex"}}>
                            <IoChevronBack size={30}/>
                        </Link>

                        <Title order={1}>{score.name}</Title>
                    </Group>
                    <Group gap={4} justify={"end"}>
                        <Button variant={"subtle"}
                                size={"md"}
                                color={"black"}
                                onClick={() => navigate(`/scores/${score?.id}`)}>
                            {t("button.cancel")}
                        </Button>
                        <Button type={"submit"}
                                size={"md"}>
                            {t("button.save")}
                        </Button>
                    </Group>
                </Group>

                <Grid mt={"lg"}>
                    <Grid.Col span={6}>
                        <InputWrapper size={"lg"} labelProps={Layout.form.LABEL_PROPS}
                                      label={t("view.editor.form.name")}>
                            <TextInput
                                size={"xl"}
                                placeholder={t("view.editor.form.name")}
                                error={errors.name?.message}
                                {...register("name", {required: t("field.required")})}
                                {...handleFocus}
                            />
                        </InputWrapper>
                    </Grid.Col>
                </Grid>

                <Grid mt={"lg"}>
                    <Grid.Col span={8}>
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
                    </Grid.Col>
                </Grid>

                <Grid mt={"lg"}>
                    <Grid.Col span={8}>
                        <InputWrapper size={"lg"} labelProps={Layout.form.LABEL_PROPS}
                                      label={t("view.editor.form.description")}>
                            <Textarea
                                size={"xl"}
                                autosize
                                minRows={2}
                                maxRows={8}
                                placeholder={t("view.editor.form.description")}
                                {...register("description")}
                                {...handleFocus}
                            />
                        </InputWrapper>
                    </Grid.Col>
                </Grid>

                <Grid mt={"md"}>
                    <Grid.Col>
                        <ScorePlaybackPanel/>
                        <ScoreEditorPanel/>
                        <Stave score={score} isEditMode/>
                    </Grid.Col>
                </Grid>

                <Grid>
                    <Grid.Col span={4}>
                        <InputWrapper size={"lg"} labelProps={Layout.form.LABEL_PROPS}
                                      label={t("view.editor.form.defaultTempo")}>
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
                        </InputWrapper>
                    </Grid.Col>
                </Grid>

                <Grid mt={"lg"}>
                    <Grid.Col span={8}>
                        <InputWrapper size={"lg"} labelProps={Layout.form.LABEL_PROPS}
                                      label={t("view.editor.form.text")}>
                            <Textarea
                                size={"xl"}
                                autosize
                                minRows={6}
                                maxRows={20}
                                placeholder={t("view.editor.form.text")}
                                {...register("text")}
                                {...handleFocus}
                            />
                        </InputWrapper>
                    </Grid.Col>
                </Grid>
            </form>
        </Page>
    )
};

export default ScoreForm;
