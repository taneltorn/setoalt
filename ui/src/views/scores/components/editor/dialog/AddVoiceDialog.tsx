import React, {useEffect, useState} from 'react';
import Dialog from "../../../../../components/dialog/Dialog.tsx";
import {useDialogContext} from "../../../../../hooks/useDialogContext.tsx";
import {useTranslation} from "react-i18next";
import {ColorPicker, InputWrapper, NativeSelect, Radio, TextInput} from "@mantine/core";
import {useScoreContext} from '../../../../../hooks/useScoreContext.tsx';
import {useForm} from 'react-hook-form';
import {Color} from "../../../../../utils/constants.ts";
import {clone} from "../../../../../utils/helpers.tsx";
import {Voice, VoiceType} from '../../../../../model/Voice.ts';
import {DialogType} from "../../../../../utils/enums.ts";

interface FormValues {
    name: string;
    color: string;
}

const DEFAULT_VALUES = {
    name: "",
    type: VoiceType.TORRO,
    color: "#00000",
}

const ColorMapping = {
    "0": Color.voice.TORRO,
    "1": Color.voice.KILLO,
    "2": Color.voice.BOTTOM_TORRO
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
        reset,
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
        reset();
    }

    const handleVoiceChange = (type: VoiceType) => {
        setVoiceType(type);
        setColor(ColorMapping[type]);
    }

    useEffect(() => {
        setVoiceNames(["-", ...(dialogContext.context.voices?.map((v: Voice) => v.name) || [])]);
    }, [dialogContext.context.voices]);

    return (
        <Dialog
            size={"lg"}
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
                    size={"xl"}
                    mb={"xl"}
                    label={t("dialog.addVoice.name")}
                >
                    <TextInput
                        size={"xl"}
                        placeholder={t("dialog.addVoice.name")}
                        {...register("name", {required: t("field.required"), validate: v => !scoreContext.score.data.voices.map(v => v.name).includes(v) || t("field.voiceExists")})}
                        error={errors.name?.message}
                        autoComplete={"off"}
                    />
                </InputWrapper>

                <InputWrapper
                    label={t("dialog.addVoice.type.label")}
                    size={"xl"}
                    mb={"xl"}
                >
                    {[VoiceType.TORRO, VoiceType.KILLO, VoiceType.BOTTOM_TORRO].map(type => (
                        <Radio
                            key={type}
                            mb={"md"}
                            size={"md"}
                            checked={type === voiceType}
                            label={t(`dialog.addVoice.type.${type}`)}
                            onChange={() => handleVoiceChange(type)}
                        />
                    ))}
                </InputWrapper>

                <InputWrapper
                    size={"xl"}
                    mt={"lg"}
                    label={t("dialog.addVoice.color")}
                >
                    <ColorPicker
                        format="hex"
                        value={color}
                        defaultValue={color}
                        onChange={setColor}
                        swatches={[Color.voice.TORRO, Color.voice.KILLO, Color.voice.BOTTOM_TORRO]}
                    />
                </InputWrapper>

                <InputWrapper
                    size={"xl"}
                    mt={"lg"}
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
