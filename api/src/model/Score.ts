export type Score = {
    id: number;
    name: string;
    description?: string;
    recording?: string;
    data: object;
    defaultTempo?: number;
    defaultTransposition?: number;
    text?: string;
    translations?: object;
    visibility?: string;
    createdBy?: string;
    modifiedBy?: string;
    createdAt?: Date;
    modifiedAt?: Date;
    deletedAt?: Date;
}