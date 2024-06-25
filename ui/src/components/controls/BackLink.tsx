import React from 'react';
import {useNavigate} from "react-router-dom";
import IconButton from "./IconButton.tsx";
import {IoIosArrowBack} from "react-icons/io";
import {useAudioContext} from "../../context/AudioContext.tsx";
import {Size} from "../../utils/constants.ts";

interface Properties {
    to?: string;
}

const BackLink: React.FC<Properties> = (props) => {

    const navigate = useNavigate();
    const {stopPlayback} = useAudioContext();

    const goBack = () => {
        stopPlayback();
        if (props.to) {
            navigate(props.to);
            return;
        }
        navigate(-1)
    }

    return (
        <IconButton
            icon={<IoIosArrowBack size={Size.icon.SM}/>}
            onClick={goBack}
        />
    )
};

export default BackLink;
