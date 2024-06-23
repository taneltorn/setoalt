import React, {ReactNode, useEffect} from "react";
import {Navigate} from 'react-router-dom';
import {useAuth} from "../context/AuthContext.tsx";

interface Properties {
    children: ReactNode;
    allowedRoles: string[];
}

const ProtectedRoute: React.FC<Properties> = ({children, allowedRoles}) => {

    const auth = useAuth();

    if (!allowedRoles.includes(auth.currentUser?.role as string)) {
        return <Navigate to="/login" replace/>;
    }

    useEffect(() => {
        auth.verify();
    }, []);

    return children;
};

export default ProtectedRoute;