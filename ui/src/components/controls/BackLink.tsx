import React from 'react';
import {useNavigate} from "react-router-dom";
import IconButton from "./IconButton.tsx";
import {IoIosArrowBack} from "react-icons/io";


const BackLink: React.FC = () => {

    const navigate = useNavigate();

    return (
        <IconButton
            icon={<IoIosArrowBack size={24}/>}
            onClick={() => navigate(-1)}
        />
    )
};

export default BackLink;
