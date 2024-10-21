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

const SaveVoiceDialog: React.FC = () => {

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
        setValue,
        formState: {errors}
    } = useForm<FormValues>({defaultValues: dialogContext.context.voice || DEFAULT_VALUES});

    const onSubmit = async (values: FormValues) => {
        const voice = {
            name: values.name.trim(),
            type: voiceType,
            color: color,
            notes: copyFrom ? clone(scoreContext.score.data.voices.find(v => v.name === copyFrom)?.notes || []) : []
        }

        if (dialogContext.context.voice) {
            dialogContext.context.voice.name = voice.name;
            dialogContext.context.voice.type = voice.type;
            dialogContext.context.voice.color = voice.color;
        } else {
            scoreContext.score.data.voices.push(voice);
        }
        dialogContext.context.onConfirm(voice);
        reset();
    }

    const handleVoiceChange = (type: VoiceType) => {
        setVoiceType(type);
        setColor(ColorMapping[type]);
    }

    useEffect(() => {
        setVoiceNames(["-", ...(scoreContext.score.data.voices?.map((v: Voice) => v.name) || [])]);
    }, [scoreContext.score.data.voices]);

    useEffect(() => {
        if (dialogContext.context.voice) {
            setValue("name", dialogContext.context.voice.name || "");
            setColor(dialogContext.context.voice.color);
            setVoiceType(dialogContext.context.voice.type);
        }
    }, [dialogContext.context]);

    return (
        <Dialog
            size={"lg"}
            type={DialogType.SAVE_VOICE}
            title={t("dialog.saveVoice.title")}
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
                    label={t("dialog.saveVoice.name")}
                >
                    <TextInput
                        size={"xl"}
                        placeholder={t("dialog.saveVoice.name")}
                        {...register("name", {
                            required: t("field.required"), validate: v => !scoreContext.score.data.voices
                                .filter(v => v.name !== scoreContext.activeVoice)
                                .map(v => v.name).includes(v.trim()) || t("field.voiceExists")
                        })}
                        error={errors.name?.message}
                        autoComplete={"off"}
                    />
                </InputWrapper>

                <InputWrapper
                    label={t("dialog.saveVoice.type.label")}
                    size={"xl"}
                    mb={"xl"}
                >
                    {[VoiceType.TORRO, VoiceType.KILLO, VoiceType.BOTTOM_TORRO].map(type => (
                        <Radio
                            key={type}
                            mb={"md"}
                            size={"md"}
                            checked={type === voiceType}
                            label={t(`dialog.saveVoice.type.${type}`)}
                            onChange={() => handleVoiceChange(type)}
                        />
                    ))}
                </InputWrapper>

                <InputWrapper
                    size={"xl"}
                    mt={"lg"}
                    label={t("dialog.saveVoice.color")}
                >
                    <ColorPicker
                        format="hex"
                        value={color}
                        defaultValue={color}
                        onChange={setColor}
                        swatches={[Color.voice.TORRO, Color.voice.KILLO, Color.voice.BOTTOM_TORRO]}
                    />
                </InputWrapper>

                {!dialogContext.context.voice &&
                    <InputWrapper
                        size={"xl"}
                        mt={"lg"}
                        label={t("dialog.saveVoice.copyFrom")}
                    >
                        <NativeSelect
                            size={"xl"}
                            value={copyFrom}
                            defaultValue={""}
                            onChange={(event) => setCopyFrom(event.currentTarget.value)}
                            data={voiceNames}
                        />
                    </InputWrapper>}
            </form>
        </Dialog>
    )
};

export default SaveVoiceDialog;
