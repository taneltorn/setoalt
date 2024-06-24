import React from 'react';
import {MdRecordVoiceOver, MdVoiceOverOff} from "react-icons/md";
import {Button} from "@mantine/core";
import {useTranslation} from "react-i18next";

interface Properties {
    active: boolean;
    disabled?: boolean;
    color?: string;
    label: string;
    onClick: (event?: any) => void;
}

const FilterButton: React.FC<Properties> = ({active, color, disabled, label, onClick}) => {

    const {t} = useTranslation();
    const ICON_SIZE = 20;

    return (
        <Button
            c={active ? "white" : "gray.5"}
            color={active ? (color || "black") : "gray.1"}
            title={t(`tooltip.${active ? "hideVoice" : "showVoice"}`)}
            className={`me-2`}
            size={"xs"}
            disabled={disabled}
            leftSection={active
                ? <MdRecordVoiceOver
                    size={ICON_SIZE}
                    style={{color: "white"}}
                />
                : <MdVoiceOverOff
                    size={ICON_SIZE}
                    style={{color: "#ccc"}}
                />}
            onClick={onClick}
        >
            {label}
        </Button>
    );
};

export default FilterButton;
