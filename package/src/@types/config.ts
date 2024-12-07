import type { Format, Omit } from "ts-vista";

import type { LogResult } from "#/functions/log";
import type { TimeData } from "#/functions/time";

/**
 * Choose between `utc` and `local` time zone,
 * or select a specific time zone by using a number from `-12` to `12`.
 */
type TimeZone = "utc" | "local" | number;

/** Data for `format()` function. */
type FormatData = {
    /** The current time. */
    time: string;
    /** The data of the current time. */
    timeData: TimeData;
    /** The title of the log. */
    title: string;
    /** The actual content of the log. */
    content: string;
};

type ExtraFunctionOptions = {
    config: Config;
    log: LogResult;
};

type ConfigBase = {
    /**
     * Whether log functions should be enabled.
     * Log with the level lower or equal to `disable` will be disabled.
     * @default -1
     */
    disable: number;
    /**
     * Whether log functions should be muted.
     * Log with the level lower or equal to `mute` will be muted,
     * and `logFunction` will be disabled as well.
     * However, the functions returned by
     * the log function (e.g. `toResult()` and `toFile()`) will still work.
     * @default -1
     */
    mute: number;
    /**
     * Select the time zone to be used in the log.
     * @default "local"
     */
    timeZone: TimeZone;
    /**
     * Custom content parser.
     * By default, objects and arrays will be stringified,
     * and there will be 1 space between each item.
     */
    parser: (content: unknown[]) => string;
    /**
     * Customize the log format.
     * @default `- [${time}] [${title}] ${content}`
     */
    format: (data: FormatData) => string;
    /**
     * Custom log function, which will be used to customize how to log.
     * @default console.log()
     */
    logger: (log: string) => void;
    /**
     * A function that will be performed automatically
     * after the log appeared in the terminal.
     */
    onDone: (options: ExtraFunctionOptions) => void;
    /**
     * A function that will be performed manually
     * by the `trigger()` function.
     */
    onTrigger: (options: ExtraFunctionOptions) => void | Promise<void>;
};

type _OutputConfigBase = {
    /**
     * Directory for the log outputs.
     * By default, the current working directory.
     * @default process.cwd()
     */
    outDir: string;
    /**
     * File name for the log outputs.
     * For example, `terminok` will generate `terminok.log`.
     * When the file size exceeds `maxFileSize`,
     * the old file will be renamed with the last access time,
     * for example, `terminok_2099_12_31_23_59_999.log`.
     * @default "terminok"
     */
    fileName: string;
    /**
     * Max size in byte for each log file. By default, 10 MiB.
     * @default 10_485_760
     */
    maxFileSize: number;
    /**
     * Whether the logs should have the code that produce color in the file.
     * @default false
     */
    isColorful: boolean;
};

/** Options for `outputfunction`. */
type OutputFunctionOptions = Format<
    {
        /**
         * Directory for the log outputs.
         * @default undefined
         */
        outDir?: string;
    } & Omit<_OutputConfigBase, "outDir" | "isColorful"> & {
            /** The actual log. */
            log: string;
        }
>;

type _OutputConfig = _OutputConfigBase & {
    /**
     * Custom output function.
     * This function accepts a log as input and
     * returns true if successful, or false if it fails.
     * @default undefined
     */
    outputFunction: (
        options: OutputFunctionOptions,
    ) => boolean | Promise<boolean>;
};

/** Output configuration for client. */
type OutputConfig = Format<Partial<_OutputConfig>>;

/** Configuration for client. */
type Config = Format<
    Partial<ConfigBase> & {
        /** Output configuration. */
        output?: OutputConfig;
    }
>;

export type {
    TimeZone,
    FormatData,
    ExtraFunctionOptions,
    OutputFunctionOptions,
    OutputConfig,
    Config,
};
