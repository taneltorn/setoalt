import React from 'react';
import {useScoreContext} from "../../context/ScoreContext";
import {useTranslation} from "react-i18next";
import {
    Badge,
    Button,
    Grid,
    Group,
    InputWrapper,
    Slider,
    Switch,
    Text,
    Textarea,
    TextInput,
    Title, useMantineTheme
} from "@mantine/core";
import {Controller, useForm} from "react-hook-form";
import useScoreService from "../../services/ScoreService.tsx";
import {DisplayError, DisplaySuccess} from "../../utils/helpers.tsx";
import {Layout, Playback} from "../../utils/constants.ts";
import {Score} from "../../models/Score.ts";
import {Link, useNavigate} from "react-router-dom";
import {IoChevronBack} from "react-icons/io5";
import {useAuth} from "../../context/AuthContext.tsx";
import PlaybackPanel from "../playback/PlaybackPanel.tsx";
import Stave from "../stave/Stave.tsx";
import StaveSelectionDialog from "../dialog/StaveSelectionDialog.tsx";
import MicroTuningDialog from "../dialog/MicroTuningDialog.tsx";
import ResetScoreDialog from "../dialog/ResetScoreDialog.tsx";
import SaveScoreDialog from "../dialog/SaveScoreDialog.tsx";
import TransposeDialog from "../dialog/TransposeDialog.tsx";

const DEFAULT_VALUES = {
    name: "",
    description: "",
    defaultTempo: Playback.DEFAULT_TEMPO,
    visibility: "PUBLIC",
}

interface Properties {
    score?: Score;
    isOpen?: boolean;
    mode?: "normal" | "modal";
}

const EditScoreForm: React.FC<Properties> = ({score, isOpen}) => {

    const [t] = useTranslation();
    const context = useScoreContext();
    const scoreService = useScoreService();
    const auth = useAuth();
    const navigate = useNavigate();
    const theme = useMantineTheme();

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
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Group mb={"sm"} justify={"space-between"}>
                <Group gap={4} align={"center"}>
                    <Link to={isOpen && score?.id ? `/scores/${score.id}` : "/scores"} style={{display: "flex"}}>
                        <IoChevronBack size={30}/>
                    </Link>

                    <Title order={1}>{score?.name}</Title>
                </Group>

                {auth.currentUser?.isAuthorized &&
                    <Group>
                        {!isOpen
                            ?
                            <Button size={"md"} onClick={() => navigate("edit")}>
                                {t("button.edit")}
                            </Button>
                            :
                            <Group gap={4}>
                                <Button size={"md"} variant={"subtle"} color={"gray.7"}
                                        onClick={() => navigate(`/scores/${score?.id}`)}>
                                    {t("button.cancel")}
                                </Button>
                                <Button size={"md"} type={"submit"}>
                                    {t("button.save")}
                                </Button>
                            </Group>}
                    </Group>}
            </Group>

            {!isOpen &&
                <Group>
                    <Badge bg={score?.visibility === "PUBLIC" ? theme.primaryColor : theme.colors.gray[5]}>
                        {t(`visibility.${score?.visibility?.toLowerCase()}`)}
                    </Badge>
                </Group>}

            {isOpen && <>
                <Group>
                    <InputWrapper size={"lg"} labelProps={Layout.form.LABEL_PROPS}
                                  label={t("view.editor.form.name")}>
                        <TextInput size={"xl"}
                                   placeholder={t("view.editor.form.name")}
                                   {...register("name", {required: t("field.required")})}
                                   error={errors.name?.message}
                                   {...handleFocus} />
                    </InputWrapper>

                </Group>

                <Group mt={"lg"}>
                    <InputWrapper size={"lg"} labelProps={Layout.form.LABEL_PROPS}
                                  label={t("view.editor.form.visibility")}>
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
                    </InputWrapper>
                </Group>
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
            </>}

            {!isOpen && score?.description &&
                <Grid mt={"md"}>
                    <Grid.Col span={8}>
                        <Text>{score.description}</Text>
                    </Grid.Col>
                </Grid>}

            <Grid mt={"xl"}>
                <Grid.Col>
                    <PlaybackPanel/>
                    <Stave score={score} isEditMode={isOpen}/>
                </Grid.Col>
            </Grid>

            {isOpen && <Grid mt={"lg"}>
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
            </Grid>}

            {isOpen && <Grid mt={"lg"}>
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
            </Grid>}

            {!isOpen && <Grid mt={"md"}>
                <Grid.Col span={8}>
                    <Text fz={18}>
                        <pre>
                        {score?.text}
                        </pre>
                    </Text>
                </Grid.Col>
            </Grid>}

            <StaveSelectionDialog/>
            <MicroTuningDialog/>
            <ResetScoreDialog/>
            <SaveScoreDialog/>
            <TransposeDialog/>
        </form>
    )
};

export default EditScoreForm;
