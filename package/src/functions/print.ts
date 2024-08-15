import type { Config } from "#/@types/config";
import type { GenerateResult } from "#/functions/generate";

type PrintOptions = {
    config: Config;
    log: GenerateResult;
};

const print = (options: PrintOptions): void => {
    const config: Config = options.config;
    const log: GenerateResult = options.log;
    return config.logger?.(log.raw) ?? console.log(log.raw);
};

export type { PrintOptions };
export { print };
