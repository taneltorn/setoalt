import {Role} from "../utils/enums.ts";

export interface UserDetails {
    id: number;
    username: string;
    firstname?: string;
    lastname?: string;
    role: Role;
    isAuthorized: boolean;
    isAdmin: boolean;
}