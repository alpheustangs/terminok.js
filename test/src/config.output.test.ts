import type { Client, Schema } from "terminok";

import * as fs from "node:fs";
import * as fsp from "node:fs/promises";
import * as path from "node:path";

import { SCHEMA_DEFAULT, createClient } from "terminok";
import { describe, expect, it } from "vitest";

describe("config.output tests", (): void => {
    it("should write to file", async (): Promise<void> => {
        const dir: string = path.resolve(process.cwd(), ".data");
        const name: string = "test";
        const target: string = path.resolve(dir, `${name}.log`);

        const log: Client<typeof SCHEMA_DEFAULT> = createClient({
            schema: SCHEMA_DEFAULT,
            config: {
                mute: 0,
                output: {
                    outDir: dir,
                    fileName: name,
                },
            },
        });

        fs.existsSync(dir) && (await fsp.rm(dir, { recursive: true }));

        await log.info("hello", "world").toFile();

        const hvFile: boolean = fs.existsSync(target);
        const hvContent: boolean = (await fsp.readFile(target))
            .toString()
            .includes("hello world");

        expect(hvFile).toBe(true);
        expect(hvContent).toBe(true);

        await log.info("goodbye", "world").toFile();

        const hvContent2: boolean = (await fsp.readFile(target))
            .toString()
            .includes("goodbye world");

        expect(hvContent2).toBe(true);
    });

    it("output config should be overrided by sub output config", async (): Promise<void> => {
        const dir: string = path.resolve(process.cwd(), ".data");
        const name: string = "error";
        const target: string = path.resolve(dir, `${name}.log`);

        const schema = [
            {
                key: "error",
                output: {
                    fileName: "error",
                },
            },
        ] as const satisfies Schema;

        const log: Client<typeof schema> = createClient({
            schema,
            config: {
                mute: 0,
                output: {
                    outDir: dir,
                    fileName: "test",
                },
            },
        });

        await log.error("error").toFile();

        const hvFile: boolean = fs.existsSync(target);
        const hvContent: boolean = (await fsp.readFile(target))
            .toString()
            .includes("error");

        expect(hvFile).toBe(true);
        expect(hvContent).toBe(true);

        await log.error("error2").toFile();

        const hvContent2: boolean = (await fsp.readFile(target))
            .toString()
            .includes("error2");

        expect(hvContent2).toBe(true);
    });
});
