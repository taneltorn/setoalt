import React from 'react';
import {MdRecordVoiceOver, MdVoiceOverOff} from "react-icons/md";
import {Button} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {Size} from "../../utils/constants.ts";
import {RxDragHandleDots2} from "react-icons/rx";
import {useScoreContext} from "../../hooks/useScoreContext.tsx";

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
    const {isEditMode} = useScoreContext();

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
                    size={Size.icon.XS}
                    style={{color: active ? "white" : "black"}}
                />
                : <MdVoiceOverOff
                    size={Size.icon.XS}
                    style={{color: "#ccc"}}
                />}
            rightSection={isEditMode && <RxDragHandleDots2 size={Size.icon.XS}/>}
            onClick={onClick}
        >
            {label}
        </Button>
    );
};

export default VoiceFilterButton;
