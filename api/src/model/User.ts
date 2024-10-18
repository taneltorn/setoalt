export type User = {
    id: string;
    username: string;
    password: string;
    firstname?: string;
    lastname?: string;
    role: string;
    createdBy?: string;
    createdAt?: Date;
    modifiedBy?: string;
    modifiedAt?: Date;
    deletedBy?: string;
    deletedAt?: Date;
}