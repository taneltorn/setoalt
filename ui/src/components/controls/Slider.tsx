import React from 'react';
import {useTranslation} from "react-i18next";
import {
    Box,
    Group,
    Slider as Component,
    Text,
} from "@mantine/core";
import {Layout} from "../../utils/constants.ts";
import {RxReset} from "react-icons/rx";

interface Properties {
    label?: string;
    isRelative?: boolean;
    value: number;
    defaultValue: number;
    min: number;
    max: number;
    step: number;
    onReset: () => void;
    onChange: (value: any) => void;
}

const Slider: React.FC<Properties> = (props) => {

    const {t} = useTranslation();

    return (

        <Box mb={"lg"}>
            <Group justify={"space-between"} mb={"md"}>
                <Text fw={"bold"}>
                    {props.label}
                </Text>
                <Group justify={"space-between"}>
                    {props.value !== props.defaultValue &&
                        <RxReset
                            size={24}
                            title={t("button.reset")}
                            onClick={props.onReset}
                            style={{cursor: "pointer"}}
                        />}
                    <Text fw={"bold"}>
                        {props.isRelative && props.value > 0 ? "+" : ""}{props.value || 0}
                    </Text>
                </Group>
            </Group>
            <Component
                display={"flex"}
                size={Layout.form.SLIDER_SIZE}
                color="gray"
                label={null}
                min={props.min}
                max={props.max}
                step={props.step}
                value={props.value || 0}
                onChange={props.onChange}
            />
        </Box>
    )
};

export default Slider;
