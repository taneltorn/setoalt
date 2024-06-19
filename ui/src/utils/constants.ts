export const Layout = {
    stave: {
        container: {
            MAX_WIDTH: 1450,
            PADDING_X_START: 60,
            PADDING_X_END: 60,
            SYMBOLS_BAR: 50,
            LYRICS_BAR: 70
        },
        line: {
            SPACING: 12,
            PRIMARY_LINE_STROKE_WIDTH: 2,
            SECONDARY_LINE_STROKE_WIDTH: 1,
            STROKE_WIDTH_BOLD: 3,
        },
        note: {
            RADIUS: 8,
            RADIUS_SMALL: 5,
            REPEATING_OFFSET: 7,
            SPACING: 60,
            SHAPE: 0,
            DIMMED_OPACITY: 0.2,
            QUARTER_NOTE_STROKE: 4,
            HALF_NOTE_STROKE: 2,
        },
        divider: {
            SEPARATOR_HEIGHT: 30,
            WIDTH: 2,
            CONTAINER_WIDTH: 15,
        },
        position: {
            WIDTH: 24,
            HEIGHT: 6,
        },
        cursor: {
            WIDTH: 24
        },
        lyrics: {
            HEIGHT: 20,
            FONT_SIZE: 16,
            FONT_WEIGHT: 600
        }
    },
    form: {
        LABEL_PROPS: {
            fw: 600, ml: 0, mb: 8
        }
    }
}

export const Color = {
    accent: {
        PRIMARY: "#870000",
        SECONDARY: "#ccc"
    },
    stave: {
        HIGHLIGHT: "#CB3333",
        PRIMARY_LINE: "#000",
        SECONDARY_LINE: "#eee",
        LYRICS: "#000"
    }
}

export const Playback = {
    MIN_TEMPO: 40,
    DEFAULT_TEMPO: 80,
    MAX_TEMPO: 120,
    TEMPO_SLIDER_STEP: 2,
    MIN_DETUNE: -100,
    MAX_DETUNE: 100,
    DETUNE_SLIDER_STEP: 1,
    MIN_TRANSPOSE: -12,
    MAX_TRANSPOSE: 12,
    TRANSPOSE_SLIDER_STEP: 1,
}