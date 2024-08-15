import type { Config } from "#/@types/config";
import type { SchemaLogConfig } from "#/base/main";

type ValidateOptions = {
    // biome-ignore lint/suspicious/noExplicitAny: allow any
    target: any;
    name: string;
    type:
        | "bigint"
        | "boolean"
        | "function"
        | "number"
        | "object"
        | "string"
        | "symbol"
        | "undefined";
    required?: boolean;
};

const validate = (options: ValidateOptions): void => {
    const { target, name, type, required } = options;

    if (!required && typeof target === "undefined") return void 0;

    // biome-ignore lint/suspicious/useValidTypeof: allow typeof
    if (typeof target !== type) {
        const _type: string =
            type === "object" || type === "undefined"
                ? `an ${type}`
                : `a ${type}`;
        throw new TypeError(`${name} is not ${_type}`);
    }
};

const validateConfig = (config?: Config): void => {
    if (!config) return void 0;

    validate({
        target: config,
        name: "options.config",
        type: "object",
    });

    validate({
        target: config.disable,
        name: "options.config.disable",
        type: "number",
    });

    validate({
        target: config.mute,
        name: "options.config.mute",
        type: "number",
    });

    if (config.timeZone) {
        if (
            config.timeZone !== "utc" &&
            config.timeZone !== "local" &&
            typeof config.timeZone !== "number"
        ) {
            throw new TypeError("options.config.timeZone is not TimeZone");
        }
    }

    validate({
        target: config.parser,
        name: "options.config.parser",
        type: "function",
    });

    validate({
        target: config.format,
        name: "options.config.format",
        type: "function",
    });

    validate({
        target: config.logger,
        name: "options.config.logger",
        type: "function",
    });

    validate({
        target: config.onDone,
        name: "options.config.onDone",
        type: "function",
    });

    validate({
        target: config.onTrigger,
        name: "options.config.onTrigger",
        type: "function",
    });

    validate({
        target: config.output,
        name: "options.config.output",
        type: "object",
    });

    validate({
        target: config.output?.outDir,
        name: "options.config.output.outDir",
        type: "string",
    });

    validate({
        target: config.output?.fileName,
        name: "options.config.output.fileName",
        type: "string",
    });

    validate({
        target: config.output?.maxFileSize,
        name: "options.config.output.maxFileSize",
        type: "number",
    });

    validate({
        target: config.output?.isColorful,
        name: "options.config.output.isColorful",
        type: "boolean",
    });

    validate({
        target: config.output?.outputFunction,
        name: "options.config.output.outputFunction",
        type: "function",
    });
};

const validateSchema = (schema?: readonly SchemaLogConfig[]): void => {
    if (!schema) return void 0;

    if (!Array.isArray(schema)) {
        throw new TypeError("options.schema is not an array");
    }

    for (let i: number = 0; i < schema.length; i++) {
        const item: SchemaLogConfig = schema[i];

        validate({
            target: item,
            name: `options.schema[${i}]`,
            type: "object",
            required: true,
        });

        validate({
            target: item.key,
            name: `options.schema[${i}].key`,
            type: "string",
            required: true,
        });

        validate({
            target: item.title,
            name: `options.schema[${i}].title`,
            type: "string",
        });

        validate({
            target: item.color,
            name: `options.schema[${i}].color`,
            type: "function",
        });

        validate({
            target: item.onDone,
            name: `options.schema[${i}].onDone`,
            type: "function",
        });

        validate({
            target: item.onTrigger,
            name: `options.schema[${i}].onTrigger`,
            type: "function",
        });

        validate({
            target: item.output,
            name: `options.schema[${i}].output`,
            type: "object",
        });

        validate({
            target: item.output?.outDir,
            name: `options.schema[${i}].output.outDir`,
            type: "string",
        });

        validate({
            target: item.output?.fileName,
            name: `options.schema[${i}].output.fileName`,
            type: "string",
        });

        validate({
            target: item.output?.maxFileSize,
            name: `options.schema[${i}].output.maxFileSize`,
            type: "number",
        });

        validate({
            target: item.output?.isColorful,
            name: `options.schema[${i}].output.isColorful`,
            type: "boolean",
        });

        validate({
            target: item.output?.outputFunction,
            name: `options.schema[${i}].output.outputFunction`,
            type: "function",
        });
    }
};

export { validateConfig, validateSchema };
