export const DateFormat = "DD.MM.yyyy HH:mm";

export const Layout = {
    stave: {
        container: {
            MAX_WIDTH: 1500,
            PADDING_X_START: 75,
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
            RADIUS_SMALL: 6,
            REPEATING_OFFSET: 7,
            SPACING: 60,
            SHAPE: 0,
            DIMMED_OPACITY: 0.2,
            QUARTER_NOTE_STROKE: 4,
            HALF_NOTE_STROKE: 2,
        },
        divider: {
            SEPARATOR_HEIGHT: 40,
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
        range: {
            WIDTH: 4,
        },
        lyrics: {
            HEIGHT: 20,
            FONT_SIZE: 16,
            DECREASED_FONT_SIZE: 14,
            FONT_WEIGHT: 600
        }
    }
}

export const Size = {
    icon: {
        XS: 20,
        SM: 24,
        MD: 32,
        LG: 48,
        XL: 64,
    }
}

export const Color = {
    stave: {
        PRIMARY_LINE: "#000",
        SECONDARY_LINE: "#eee",
    },
    voice: {
        TORRO: "#000000",
        KILLO: "#1aa7ec",
        BOTTOM_TORRO: "#777777",
    }
}

export const Playback = {
    DEFAULT_INSTRUMENT: "synth",

    DEFAULT_VOLUME: -10,
    MIN_VOLUME: -60,
    MAX_VOLUME: 0,
    VOLUME_STEP: 5,

    DEFAULT_TEMPO: 80,
    MIN_TEMPO: 20,
    MAX_TEMPO: 240,
    TEMPO_STEP: 1,
    ALLOWED_TEMPO_CHANGE: 1,

    MIN_DETUNE: -100,
    MAX_DETUNE: 100,
    DETUNE_STEP: 1,

    DEFAULT_TRANSPOSITION: 0,
    MIN_TRANSPOSITION: -12,
    MAX_TRANSPOSITION: 12,
    TRANSPOSITION_STEP: 1,
}