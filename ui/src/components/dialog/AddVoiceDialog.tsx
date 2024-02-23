import React, {useEffect, useState} from 'react';
import Dialog from "./Dialog";
import {DialogType, useDialogContext} from "../../context/DialogContext";
import {useTranslation} from "react-i18next";
import {Button, Group, InputWrapper, NativeSelect, TextInput} from "@mantine/core";
import {useScoreContext} from '../../context/ScoreContext.tsx';
import {useForm} from 'react-hook-form';
import {Layout} from "../../utils/constants.ts";
import {clone} from "../../utils/helpers.tsx";
import {Voice} from '../../models/Voice.ts';

interface FormValues {
    name: string;
    color: string;
}

const DEFAULT_VALUES = {
    name: "",
    color: "#00000",
}

const AddVoiceDialog: React.FC = () => {

    const [t] = useTranslation();
    const dialogContext = useDialogContext();
    const scoreContext = useScoreContext();
    const [copyFrom, setCopyFrom] = useState<string>("-");
    const [voiceNames, setVoiceNames] = useState<string[]>([]);

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<FormValues>({defaultValues: DEFAULT_VALUES});

    const onSubmit = async (values: FormValues) => {
        const voice = {
            name: values.name,
            color: values.color,
            notes: copyFrom ? clone(scoreContext.score.data.voices.find(v => v.name === copyFrom)?.notes || []) : []
        }
        scoreContext.score.data.voices.push(voice);

        dialogContext.context.onConfirm(voice);
    }

    useEffect(() => {
        setVoiceNames(["-", ...(dialogContext.context.voices?.map((v: Voice) => v.name) || [])]);
    }, [dialogContext.context.voices]);

    return (
        <Dialog
            type={DialogType.ADD_VOICE}
            title={t("dialog.addVoice.title")}
            hidePrimaryButton
            hideSecondaryButton
            onClose={dialogContext.close}
        >
            <form onSubmit={handleSubmit(onSubmit)} noValidate>

                <InputWrapper size={"lg"} labelProps={Layout.form.LABEL_PROPS}
                              label={t("dialog.addVoice.name")}>
                    <TextInput
                        size={"xl"}
                        placeholder={t("dialog.addVoice.name")}
                        {...register("name", {required: t("field.required")})}
                        error={errors.name?.message}
                    />
                </InputWrapper>

                <InputWrapper mt={"lg"}
                              size={"lg"} labelProps={Layout.form.LABEL_PROPS}
                              label={t("dialog.addVoice.color")}>
                    <TextInput
                        size={"xl"}
                        placeholder={t("dialog.addVoice.color")}
                        {...register("color", {required: t("field.required")})}
                        error={errors.color?.message}
                    />
                </InputWrapper>

                <InputWrapper mt={"lg"} size={"lg"} labelProps={Layout.form.LABEL_PROPS}
                              label={t("dialog.addVoice.copyFrom")}>
                    <NativeSelect
                        size={"xl"}
                        value={copyFrom}
                        defaultValue={""}
                        onChange={(event) => setCopyFrom(event.currentTarget.value)}
                        data={voiceNames}
                    />
                </InputWrapper>

                <Group justify={"end"} mt={"md"}>
                    <Button mt={"md"} size={"lg"} variant={"light"} color={"gray.9"}
                            onClick={dialogContext.close}>
                        {t("button.cancel")}
                    </Button>
                    <Button mt={"md"} size={"lg"} type={"submit"}>
                        {t("button.save")}
                    </Button>
                </Group>
            </form>
        </Dialog>
    )
};

export default AddVoiceDialog;
