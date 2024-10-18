export type UserDTO = {
    id: string;
    username: string;
    firstname?: string;
    lastname?: string;
    role: string;
    createdAt?: Date;
    modifiedAt?: Date;
}