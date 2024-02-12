import React, {useEffect, useState} from "react";
import {DisplayGlobalError} from "../utils/helpers.tsx";

const API_URL = import.meta.env.VITE_API_URL;

const ApiStatus: React.FC = () => {

    const [ok, setOk] = useState<boolean>(false);

    useEffect(() => {
        console.log(`GET ${API_URL}/api-status`)
        fetch(`${API_URL}/status`)
            .then(response => {
                setOk(response.ok)
            })
            .catch(e =>  DisplayGlobalError("Error", e.message))
    }, []);

    return (
        <>
            <p>API Status:</p>
            <p>{ok ? "OK" : "ERROR"}</p>
        </>
    );
}

export default ApiStatus;
