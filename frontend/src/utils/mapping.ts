import {ShortKey} from "./keymap";

export const DurationToShortKey = new Map<string, ShortKey>([
    ["2n", ShortKey.HALF_NOTE],
    ["4n", ShortKey.QUARTER_NOTE],
    ["8n", ShortKey.EIGHT_NOTE],
]);