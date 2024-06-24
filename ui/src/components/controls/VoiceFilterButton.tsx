import React from 'react';
import {MdRecordVoiceOver, MdVoiceOverOff} from "react-icons/md";
import {Button} from "@mantine/core";
import {useTranslation} from "react-i18next";

interface Properties {
    active: boolean;
    halfActive?: boolean;
    disabled?: boolean;
    c?: string;
    color?: string;
    label: string;
    onClick: (event?: any) => void;
}

const VoiceFilterButton: React.FC<Properties> = ({active, halfActive, disabled, label, onClick}) => {

    const {t} = useTranslation();
    const ICON_SIZE = 20;

    return (
        <Button
            c={active ? "white" : halfActive ? "black" : "gray.5"}
            color={active ? "black" : "gray.1"}
            title={t(`tooltip.${active ? "hideVoice" : "showVoice"}`)}
            className={`me-2`}
            size={"xs"}
            disabled={disabled}
            leftSection={active || halfActive
                ? <MdRecordVoiceOver
                    size={ICON_SIZE}
                    style={{color: active ? "white" : "black"}}
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

export default VoiceFilterButton;
