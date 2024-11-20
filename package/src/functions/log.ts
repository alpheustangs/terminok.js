import type { Config, Format } from "#/@types/config";
import type { SchemaLogConfig } from "#/base/main";
import type { GenerateResult } from "#/functions/generate";

import { generate } from "#/functions/generate";
import { output } from "#/functions/output";
import { print } from "#/functions/print";

type LogOptions = {
    config?: Config;
    logConfig: SchemaLogConfig;
    content: unknown[];
};

/** Log result returned by the `toResult()` function. */
type LogResult = Format<GenerateResult>;

const createLog = (options: LogOptions) => {
    const defaultColor = (content: string): string => content;

    const config: Config = options.config ?? {};
    const logConfig: SchemaLogConfig = options.logConfig;
    const log: GenerateResult = generate({
        config,
        title: logConfig.title ?? logConfig.key,
        color: logConfig.color ?? defaultColor,
        content: options.content,
    });

    const disableLevel: number = config.disable ?? -1;
    const muteLevel: number = config.mute ?? -1;
    const level: number = logConfig.level ?? 0;

    const disable: boolean = disableLevel >= level;
    const mute: boolean = muteLevel >= level;

    !disable && !mute && print({ config, log });

    const finalConfig = {
        config: {
            ...config,
            output: {
                ...config.output,
                ...logConfig.output,
            },
        },
        log,
    };

    config.onDone?.(finalConfig);
    logConfig.onDone?.(finalConfig);

    return {
        /**
         * Return the current log as different formats.
         *
         * #### Example
         *
         * ```ts
         * import type {
         *     Client,
         *     LogResult,
         * } from "terminok";
         * import { createClient, SCHEMA_DEFAULT } from "terminok";
         *
         * const log: Client<typeof SCHEMA_DEFAULT> = createClient({
         *     schema: SCHEMA_DEFAULT,
         * });
         *
         * const {
         *     raw,
         *     log,
         *     content,
         * }: LogResult = log.info("hello").toResult();
         * ```
         */
        toResult: (): LogResult => {
            if (disable)
                return {
                    raw: "",
                    log: "",
                    content: "",
                };

            return log;
        },
        /**
         * Output the current log into file.
         * A boolean will be returned as a result,
         * indicating whether the output is successful.
         * By default it will only works in Node environment.
         *
         * #### Example
         *
         * ```ts
         * import type { Client } from "terminok";
         * import { createClient, SCHEMA_DEFAULT } from "terminok";
         *
         * const log: Client<typeof SCHEMA_DEFAULT> = createClient({
         *     schema: SCHEMA_DEFAULT,
         * });
         *
         * await log.info("hello").toFile(); // true / false
         * ```
         */
        toFile: async (): Promise<boolean> => {
            if (disable) return false;
            return await output(finalConfig);
        },
        /**
         * Triggerable function for the log.
         * A boolean will be returned as a result,
         * indicating whether the function is successful.
         *
         * #### Example
         *
         * ```ts
         * import type {
         *     Client,
         *     Schema,
         *     ExtraFunctionOptions
         * } from "terminok";
         * import { createClient, COLORS } from "terminok";
         *
         * const customSchema = [
         *     {
         *         key: "ping",
         *         color: COLORS.red,
         *         onTrigger: (
         *             options: ExtraFunctionOptions,
         *         ): boolean => {
         *             return true;
         *         }
         *     }
         * ] as const satisfies Schema;
         *
         * const log: Client<typeof customSchema> = createClient({
         *     schema: customSchema,
         * });
         *
         * await log.info("hello").trigger(); // true
         * ```
         */
        trigger: async (): Promise<void> => {
            await config.onTrigger?.(finalConfig);
            await logConfig.onTrigger?.(finalConfig);
        },
    };
};

/** Log type returned by different log functions. */
type Log = ReturnType<typeof createLog>;

export type { LogOptions, Log, LogResult };
export { createLog };
