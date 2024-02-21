export enum DividerType {
    BAR = "Bar",
    SEPARATOR = "Separator"
}

export interface Divider {
    position: number;
    type: DividerType;
}
