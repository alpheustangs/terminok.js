import type { Stats } from "node:fs";

import type { Config, OutputConfig } from "#/@types/config";
import type { GenerateResult } from "#/functions/generate";
import type { TimeData } from "#/functions/time";

import { getTimeData } from "#/functions/time";

type OutputOptions = {
    config: Config;
    log: GenerateResult;
};

const output = async (options: OutputOptions): Promise<boolean> => {
    const config: Config = options.config;
    const output: OutputConfig = config.output as OutputConfig;
    const log: string = output.isColorful ? options.log.raw : options.log.log;

    if (output.outputFunction) {
        return await output.outputFunction({
            outDir: output.outDir,
            fileName: output.fileName ?? "terminok",
            maxFileSize: output.maxFileSize ?? 10_485_760,
            log,
        });
    }

    try {
        let path: typeof import("node:path");
        let fs: typeof import("node:fs");
        let fsp: typeof import("node:fs/promises");

        try {
            path = await import("node:path");
            fs = await import("node:fs");
            fsp = await import("node:fs/promises");
        } catch (e: unknown) {
            if (process.env.NODE_ENV !== "production") {
                throw new Error("Node.js is required to output the log");
            }

            return false;
        }

        const outDir: string = output.outDir ?? path.resolve(process.cwd());

        // directory
        if (!fs.existsSync(outDir)) {
            await fsp.mkdir(outDir, { recursive: true });
        }

        const fileName: string = output.fileName ?? "terminok";
        const filePath: string = path.join(outDir, `${fileName}.log`);
        const content: string = `${log}\n`;

        // file
        if (fs.existsSync(filePath)) {
            const stat: Stats = await fsp.stat(filePath);

            // file exists and over the max size,
            // rename old file and create new file
            if (stat.size >= (output.maxFileSize ?? 10_485_760)) {
                const timeData: TimeData = getTimeData({
                    timeZone: config.timeZone ?? "local",
                });

                const logDate: string =
                    // biome-ignore lint/style/useTemplate: readability
                    timeData.year +
                    "_" +
                    timeData.month +
                    "_" +
                    timeData.day +
                    "_" +
                    timeData.hour +
                    "_" +
                    timeData.minute +
                    "_" +
                    timeData.millisecond;

                await fsp.rename(
                    filePath,
                    path.join(outDir, `${fileName}_${logDate}.log`),
                );

                await fsp.writeFile(filePath, content);
            }
            // file exists and under the max size, append to file
            else {
                await fsp.appendFile(filePath, content);
            }
        }
        // file not exists, create new one
        else {
            await fsp.writeFile(filePath, content);
        }

        return true;
    } catch (e: unknown) {
        return false;
    }
};

export type { OutputOptions };
export { output };
