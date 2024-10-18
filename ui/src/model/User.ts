import {Role} from "../utils/enums.ts";

export interface User {
    id?: number;
    username: string;
    password: string;
    firstname?: string;
    lastname?: string;
    role: Role;
    createdAt?: Date;
    modifiedAt?: Date;
}