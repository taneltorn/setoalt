import React from 'react';
import {MdRecordVoiceOver, MdVoiceOverOff} from "react-icons/md";
import {Button} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {Size} from "../../utils/constants.ts";
import {RxDragHandleDots2} from "react-icons/rx";
import {useScoreContext} from "../../hooks/useScoreContext.tsx";

interface Properties {
    state: "active" | "semi-active" | "disabled";
    disabled?: boolean;
    c?: string;
    color?: string;
    label: string;
    onClick: (event?: any) => void;
}

const VoiceFilterButton: React.FC<Properties> = ({state,  disabled, label, onClick}) => {

    const {t} = useTranslation();
    const {isEditMode} = useScoreContext();

    return (
        <Button
            c={state === "active" ? "white" : state === "semi-active" ? "black" : "gray.5"}
            color={state === "active" ? "black" : "gray.1"}
            title={t(`tooltip.${state !== "disabled" ? "hideVoice" : "showVoice"}`)}
            className={`me-2`}
            size={"compact-sm"}
            disabled={disabled}
            leftSection={state !== "disabled"
                ? <MdRecordVoiceOver
                    size={Size.icon.XS}
                    style={{color: state === "active" ? "white" : "black"}}
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
