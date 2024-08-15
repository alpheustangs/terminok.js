import type { Schema } from "#/base/main";

import { COLORS } from "#/utils/color";

/**
 * Default Schema for client,
 * which includes different basic log functions:
 * `info`, `wait`, `ready`, `warn`, `error`, `cancel`.
 */
const SCHEMA_DEFAULT = [
    {
        key: "info",
        color: COLORS.blue,
    },
    {
        key: "wait",
        color: COLORS.purple,
    },
    {
        key: "ready",
        color: COLORS.green,
    },
    {
        key: "warn",
        color: COLORS.yellow,
    },
    {
        key: "error",
        color: COLORS.red,
    },
    {
        key: "cancel",
        color: COLORS.redDark,
    },
] as const satisfies Schema;

export { SCHEMA_DEFAULT };
