import React from 'react';
import {useTranslation} from "react-i18next";
import {
    Box,
    Group,
    Slider as Component,
    Text,
} from "@mantine/core";
import {RxReset} from "react-icons/rx";
import {Size} from "../../utils/constants.ts";

interface Properties {
    label?: string;
    isRelative?: boolean;
    value: number;
    defaultValue: number;
    min: number;
    max: number;
    step: number;
    onReset: () => void;
    onChange: (value: number) => void;
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
                            size={Size.icon.SM}
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
                size={"lg"}
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
