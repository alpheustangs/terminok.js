import type {
    Config,
    ExtraFunctionOptions,
    Format,
    OutputConfig,
} from "#/@types/config";
import type { Log } from "#/functions/log";

import { createLog } from "#/functions/log";
import { validateConfig, validateSchema } from "#/functions/validate";

type SchemaLogConfigBase = {
    /** This parameter will be used to call the log function. */
    key: string;
};

type SchemaLogConfigOptional = {
    /**
     * This parameter will be used when `disable` or `mute` is set to `true`.
     * If the `disable` number or `mute` number is greater than the level,
     * the log will be disabled or muted, vice versa.
     * @default 0
     */
    level: number;
    /**
     * This parameter will be used as the title of the log,
     * and `key` parameter will be used instead if not specified.
     */
    title: string;
    /**
     * This function will be used to color the log title.
     * No color will be applied if not specified.
     */
    color: (content: string) => string;
    /**
     * A function that will be performed automatically
     * after the log appeared in the terminal.
     * This function will **NOT** override the `onDone` function in config
     * but run after it.
     */
    onDone: (options: ExtraFunctionOptions) => void;
    /**
     * A function that will be performed manually
     * by the `trigger()` function.
     * This function will **NOT** override the `onTrigger` function in config
     * but run after it.
     */
    onTrigger: (options: ExtraFunctionOptions) => void | Promise<void>;
    /** Output configuration that will override the default output config. */
    output: OutputConfig;
};

/** Log config for schema. */
type SchemaLogConfig = Format<
    SchemaLogConfigBase & Partial<SchemaLogConfigOptional>
>;

/** `createClient` schema. */
type Schema = SchemaLogConfig[];

/**
 * Client type,
 * a read only schema type is required as a parameter.
 */
type Client<T extends readonly SchemaLogConfig[]> = {
    [K in T[number]["key"]]: (...content: unknown[]) => Log;
};

/**
 * This function creates a client with the given options.
 *
 * ### Example
 *
 * ```ts
 * import type { Client } from "terminok";
 * import { createClient, SCHEMA_DEFAULT } from "terminok";
 *
 * const log: Client<typeof SCHEMA_DEFAULT> = createClient({
 *     schema: SCHEMA_DEFAULT,
 * });
 *
 * log.info("Hello");
 * ```
 */
const createClient = <
    ClientSchema extends readonly SchemaLogConfig[],
    LogKey extends string = ClientSchema[number]["key"],
>(options: {
    /**
     * The config to be used.
     *
     * #### Example
     *
     * ```ts
     * import type { Client, Config } from "terminok";
     * import { createClient, SCHEMA_DEFAULT } from "terminok";
     *
     * const customConfig: Config = {
     *     enable: process.env.NODE_ENV === "development",
     *     timeZone: "utc",
     * };
     *
     * const log: Client<typeof SCHEMA_DEFAULT> = createClient({
     *     config: customConfig,
     *     schema: SCHEMA_DEFAULT,
     * });
     *
     * log.info("Hello");
     * ```
     */
    config?: Config;
    /**
     * The schema to be used.
     * If not specified, nothing will be returned.
     * To use the default schema, import `SCHEMA_DEFAULT`.
     *
     * #### Example
     *
     * This example creates a client with the default schema.
     *
     * ```ts
     * import type { Client } from "terminok";
     * import { createClient, SCHEMA_DEFAULT } from "terminok";
     *
     * const log: Client<typeof SCHEMA_DEFAULT> = createClient({
     *     schema: SCHEMA_DEFAULT,
     * });
     *
     * log.info("Hello");
     * ```
     *
     * This example creates a client with the custom schema.
     *
     * ```ts
     * import type { Client, Schema } from "terminok";
     * import { createClient, COLORS } from "terminok";
     *
     * const customSchema = [
     *     {
     *         key: "ping",
     *         color: COLORS.red,
     *     }
     * ] as const satisfies Schema;
     *
     * const log: Client<typeof schema> = createClient({
     *     schema: customSchema,
     * });
     *
     * log.ping("pong");
     * ```
     */
    schema?: ClientSchema;
    /**
     * Whether to validate the config and schema.
     * Set it to `false` if using TypeScript
     * and tend to improve the performance
     * by **NOT** validating both config and schema.
     * @default true
     */
    typesafe?: boolean;
}): Client<ClientSchema> => {
    const typesafe: boolean =
        typeof options.typesafe === "boolean" ? options.typesafe : true;

    if (typesafe) {
        validateConfig(options.config);
        validateSchema(options.schema);
    }

    const result = {} as Client<ClientSchema>;

    if (!options.schema) return result;

    for (let i: number = 0; i < options.schema.length; i++) {
        const item: SchemaLogConfig = options.schema[i] as SchemaLogConfig;

        result[item.key as LogKey] = (...content: unknown[]): Log => {
            return createLog({
                config: options.config,
                logConfig: item,
                content,
            });
        };
    }

    return result;
};

export type { Client, Schema, SchemaLogConfig, ExtraFunctionOptions };
export { createClient };
