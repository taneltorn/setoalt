import {Role} from "../context/AuthContext.tsx";

export interface User {
    id?: number;
    username: string;
    password: string;
    role: Role;
}