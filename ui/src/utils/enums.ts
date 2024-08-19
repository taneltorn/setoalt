export enum Role {
    ADMIN = "ADMIN",
    EDITOR = "EDITOR",
    USER = "USER",
}

export enum DialogType {
    MICRO_TUNING,
    CLEAR_SCORE,
    SAVE_SCORE,
    REMOVE_SCORE,
    SAVE_USER,
    SAVE_NOTIFICATION,
    REMOVE_NOTIFICATION,
    REMOVE_USER,
    TRANSPOSE,
    CHANGE_TEMPO,
    STAVE_SELECTION,
    JSON,
    ADD_VOICE,
    EMBED_SCORE,
    LOGIN,
}

export enum ShiftMode {
    NOTES,
    LYRICS,
    VOICES,
}