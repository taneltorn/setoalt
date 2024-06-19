import React, {useEffect, useState} from 'react';
import Dialog from "../../../../../components/dialog/Dialog.tsx";
import {DialogType, useDialogContext} from "../../../../../context/DialogContext.tsx";
import {useTranslation} from "react-i18next";
import {ColorPicker, InputWrapper, NativeSelect, Switch, TextInput} from "@mantine/core";
import {useScoreContext} from '../../../../../context/ScoreContext.tsx';
import {useForm} from 'react-hook-form';
import {Layout} from "../../../../../utils/constants.ts";
import {clone} from "../../../../../utils/helpers.tsx";
import {Voice, VoiceType} from '../../../../../models/Voice.ts';

interface FormValues {
    name: string;
    color: string;
}

const DEFAULT_VALUES = {
    name: "",
    type: VoiceType.TORRO,
    color: "#00000",
}

const AddVoiceDialog: React.FC = () => {

    const [t] = useTranslation();
    const dialogContext = useDialogContext();
    const scoreContext = useScoreContext();
    const [copyFrom, setCopyFrom] = useState<string>("-");
    const [color, setColor] = useState<string>(DEFAULT_VALUES.color);
    const [voiceType, setVoiceType] = useState<VoiceType>(VoiceType.TORRO);
    const [voiceNames, setVoiceNames] = useState<string[]>([]);

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<FormValues>({defaultValues: DEFAULT_VALUES});

    const onSubmit = async (values: FormValues) => {
        const voice = {
            name: values.name,
            type: voiceType,
            color: color,
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
            primaryButtonLabel={t("button.save")}
            secondaryButtonLabel={t("button.cancel")}
            onPrimaryButtonClick={handleSubmit(onSubmit)}
            onSecondaryButtonClick={dialogContext.close}
            onClose={dialogContext.close}
        >
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <InputWrapper
                    size={"lg"}
                    labelProps={Layout.form.LABEL_PROPS}
                    label={t("dialog.addVoice.name")}
                >
                    <TextInput
                        size={"xl"}
                        placeholder={t("dialog.addVoice.name")}
                        {...register("name", {required: t("field.required")})}
                        error={errors.name?.message}
                    />
                </InputWrapper>

                <InputWrapper
                    mt={"lg"}
                    size={"lg"}
                    labelProps={Layout.form.LABEL_PROPS}
                    label={t("dialog.addVoice.type.label")}
                >
                    <Switch
                        size={"xl"}
                        className={"hover-pointer"}
                        checked={voiceType === VoiceType.KILLO}
                        label={t(`dialog.addVoice.type.${voiceType}`)}
                        onChange={() => setVoiceType(voiceType === VoiceType.TORRO ? VoiceType.KILLO : VoiceType.TORRO)}
                    />
                </InputWrapper>

                <InputWrapper
                    mt={"lg"}
                    size={"lg"}
                    labelProps={Layout.form.LABEL_PROPS}
                    label={t("dialog.addVoice.color")}
                >
                    <ColorPicker
                        format="hex"
                        defaultValue={color}
                        onChange={setColor}
                        swatches={['#000000', '#777777', '#1aa7ec']}
                    />
                </InputWrapper>

                <InputWrapper
                    mt={"lg"}
                    size={"lg"}
                    labelProps={Layout.form.LABEL_PROPS}
                    label={t("dialog.addVoice.copyFrom")}
                >
                    <NativeSelect
                        size={"xl"}
                        value={copyFrom}
                        defaultValue={""}
                        onChange={(event) => setCopyFrom(event.currentTarget.value)}
                        data={voiceNames}
                    />
                </InputWrapper>
            </form>
        </Dialog>
    )
};

export default AddVoiceDialog;
