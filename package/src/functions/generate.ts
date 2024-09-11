import type { Config, FormatData } from "#/@types/config";
import type { TimeData } from "#/functions/time";

import { getTime, getTimeData } from "#/functions/time";

type GenerateOptions = {
    config: Config;
    title: string;
    color: (content: string) => string;
    content: unknown[];
};

type GenerateResult = {
    /** This contains the actual log with color in the terminal. */
    raw: string;
    /** This contains the colorless log for further processing. */
    log: string;
    /** This contains only the content for further processing.  */
    content: string;
};

const formatter = ({
    config,
    options,
}: {
    config: Config;
    options: FormatData;
}) => {
    return config.format
        ? config.format(options)
        : `- [${options.time}] [${options.title}] ${options.content}`;
};

const generate = (options: GenerateOptions): GenerateResult => {
    const config: Config = options.config;

    const timeData: TimeData = getTimeData({
        timeZone: config.timeZone ?? "local",
    });

    const time: string = getTime(timeData);

    const title: string = options.color(options.title);
    const titleColorless: string = options.title;

    let content: string = "";

    if (config.parser) {
        content = config.parser(options.content);
    } else {
        for (let i: number = 0; i < options.content.length; i++) {
            const item: unknown = options.content[i];

            if (typeof item === "object" || Array.isArray(item)) {
                content += `${JSON.stringify(item)} `;
                continue;
            }

            content += `${item} `;
        }
    }

    return {
        raw: formatter({
            config,
            options: {
                time,
                timeData,
                title,
                content,
            },
        }),
        log: formatter({
            config,
            options: {
                time,
                timeData,
                title: titleColorless,
                content,
            },
        }),
        content,
    };
};

export type { GenerateOptions, GenerateResult };
export { generate };
