type UserDTO = {
    id: number;
    username: string;
    password: string;
    role: string;
    createdBy: string;
    createdAt: object;
    modifiedBy: null | string;
    modifiedAt: object;
    deletedBy: null | string;
    deletedAt: null | object;
};
