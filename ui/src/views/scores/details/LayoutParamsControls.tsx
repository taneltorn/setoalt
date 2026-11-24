import React from "react";
import {ActionIcon, Group, Tooltip} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {Layouts, useLayoutParams} from "../../../hooks/useLayoutParams.tsx";
import {Size} from "../../../utils/constants.ts";
import {HiOutlineZoomIn, HiOutlineZoomOut} from "react-icons/hi";


const LayoutParamsControls: React.FC = () => {

    const {t} = useTranslation();
    const {params, setParams} = useLayoutParams();

    const handleClick = (offset: number) => {
        const index = Layouts.findIndex(l => l.name === params.name);

        const layout = Layouts[index + offset];
        setParams(layout);
    }

    return (
        <Group gap={0}>
            <Tooltip label={t("button.decreaseZoom")}>
                <ActionIcon
                    disabled={params.name === "sm"}
                    color={"dark.7"}
                    variant={"subtle"}
                    size={"xl"}
                    onClick={() => handleClick(-1)}
                >
                    <HiOutlineZoomOut size={Size.icon.SM}/>
                </ActionIcon>
            </Tooltip>
            <Tooltip label={t("button.increaseZoom")}>
                <ActionIcon
                    color={"dark.7"}
                    variant={"subtle"}
                    size={"xl"}
                    disabled={params.name === "lg"}
                    onClick={() => handleClick(1)}
                >
                    <HiOutlineZoomIn size={Size.icon.SM}/>
                </ActionIcon>
            </Tooltip>
        </Group>
    );
}

export default LayoutParamsControls;
