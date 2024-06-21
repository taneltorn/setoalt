import React from 'react';
import {useNavigate} from "react-router-dom";
import IconButton from "./IconButton.tsx";
import {IoIosArrowBack} from "react-icons/io";

interface Properties {
    to?: string;
}

const BackLink: React.FC<Properties> = (props) => {

    const navigate = useNavigate();

    return (
        <IconButton
            icon={<IoIosArrowBack size={24}/>}
            onClick={() => props.to ? navigate(props.to) : navigate(-1)}
        />
    )
};

export default BackLink;
