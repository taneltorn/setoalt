export type Score = {
    id: number;
    name: string;
    description?: string;
    data: object;
    defaultTempo?: number;
    defaultTransposition?: number;
    text?: string;
    visibility?: string;
    createdBy?: string;
    modifiedBy?: string;
    createdAt?: Date;
    modifiedAt?: Date;
    deletedAt?: Date;
}