import React from 'react';
import {MdRecordVoiceOver, MdVoiceOverOff} from "react-icons/md";
import {Button} from "@mantine/core";
import {useTranslation} from "react-i18next";

interface Properties {
    active: boolean;
    label: string;
    onClick: () => void;
}

const VoiceFilterButton: React.FC<Properties> = ({active, label, onClick}) => {

    const {t} = useTranslation();
    const ICON_SIZE = 20;

    return (
        <Button
            c={active ? "white" : "gray.5"}
            color={active ? "black" : "gray.1"}
            title={t(`tooltip.${!active ? "hideVoice" : "showVoice"}`)}
            className={`me-2`}
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

export default VoiceFilterButton;
