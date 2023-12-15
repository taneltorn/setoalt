export const Layout = {
    stave: {
        container: {
            MAX_WIDTH: 1450,
            PADDING_X_START: 60,
            PADDING_X_END: 60,
            PADDING_Y_TOP: 0,
            NOTES_PER_BLOCK: 15,
            SYMBOLS_BAR: 15
        },
        line: {
            SPACING: 12,
            PRIMARY_LINE_STROKE_WIDTH: 2,
            SECONDARY_LINE_STROKE_WIDTH: 1,
            STROKE_WIDTH_BOLD: 3,
        },
        note: {
            RADIUS: 7,
            REPEATING_OFFSET: 7,
            SPACING: 50,
            SHAPE: 0
        },
        divider: {
            WIDTH: 2,
            CONTAINER_WIDTH: 15,
        },
        cursor: {
            WIDTH: 24
        }
    },
    lyrics: {
        SPACING: 60,
        HEIGHT: 100,
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