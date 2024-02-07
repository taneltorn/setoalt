export enum DividerType {
    BREAK = "Break",
    BAR = "Bar",
    SEPARATOR = "Separator"
}

export interface Divider {
    position: number;
    type: DividerType;
}
