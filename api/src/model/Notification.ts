export type Notification = {
    id: number;
    title: string;
    message: string;
    validFrom: Date | null;
    validTo: Date | null;
}