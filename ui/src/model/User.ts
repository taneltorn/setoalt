import {Role} from "../context/AuthContext.tsx";

export interface User {
    id?: number;
    username: string;
    password: string;
    firstname?: string;
    lastname?: string;
    role: Role;
}