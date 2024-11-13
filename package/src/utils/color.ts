const addColor = (color: string, text: string): string => {
    return `${color}${text}\x1b[0m`;
};

/**
 * This object contains different functions to add colors to strings.
 *
 * ## Example
 *
 * ```ts
 * import { COLORS } from "terminok";
 *
 * const redHello: string = COLORS.blue("hello");
 * ```
 */
const COLORS = {
    // red
    redLight: (val: string): string => addColor("\x1b[38;5;204m", val),
    red: (val: string): string => addColor("\x1b[38;5;9m", val),
    redDark: (val: string): string => addColor("\x1b[38;5;1m", val),

    // yellow
    yellowLight: (val: string): string => addColor("\x1b[38;5;228m", val),
    yellow: (val: string): string => addColor("\x1b[38;5;221m", val),
    yellowDark: (val: string): string => addColor("\x1b[38;5;136m", val),

    // blue
    blueLight: (val: string): string => addColor("\x1b[38;5;117m", val),
    blue: (val: string): string => addColor("\x1b[38;5;39m", val),
    blueDark: (val: string): string => addColor("\x1b[38;5;69m", val),

    // green
    greenLight: (val: string): string => addColor("\x1b[38;5;49m", val),
    green: (val: string): string => addColor("\x1b[38;5;10m", val),
    greenDark: (val: string): string => addColor("\x1b[38;5;23m", val),

    // purple
    purpleLight: (val: string): string => addColor("\x1b[38;5;219m", val),
    purple: (val: string): string => addColor("\x1b[38;5;127m", val),
    purpleDark: (val: string): string => addColor("\x1b[38;5;89m", val),
};

type Colors = typeof COLORS;
type Color = keyof Colors;

export type { Colors, Color };
export { COLORS };
