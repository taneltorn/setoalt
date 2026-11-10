export interface LayoutParams {
    name: string;

    CONTAINER_MIN_WIDTH: number;
    CONTAINER_MAX_WIDTH: number;
    CONTAINER_PADDING_X_START: number;
    CONTAINER_PADDING_X_END: number;
    CONTAINER_SYMBOLS_BAR: number;
    CONTAINER_LYRICS_BAR: number;

    LINE_SPACING: number;
    LINE_PRIMARY_LINE_STROKE_WIDTH: number;
    LINE_SECONDARY_LINE_STROKE_WIDTH: number;
    LINE_STROKE_WIDTH_BOLD: number;

    NOTE_RADIUS: number;
    NOTE_RADIUS_SMALL: number;
    NOTE_REPEATING_OFFSET: number;
    NOTE_SPACING: number;

    DIVIDER_SEPARATOR_HEIGHT: number;
    DIVIDER_WIDTH: number;
    DIVIDER_CONTAINER_WIDTH: number;

    POSITION_WIDTH: number;
    POSITION_HEIGHT: number;

    CURSOR_WIDTH: number;

    RANGE_WIDTH: number;

    LYRICS_HEIGHT: number;
    LYRICS_FONT_SIZE: number;
    LYRICS_INCREASED_FONT_SIZE: number;
    LYRICS_DECREASED_FONT_SIZE: number;
    LYRICS_FONT_WEIGHT: number;
    LYRICS_DECREASE_FONT_FROM: number;
    LYRICS_TEXT_HEIGHT: number;
    LYRICS_TEXT_GAP: number;

    EMBEDDING_BASE: number;
    EMBEDDING_ROW: number;
}
