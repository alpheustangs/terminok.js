import type { Client } from "terminok";

import { SCHEMA_DEFAULT, createClient } from "terminok";
import { describe, expect, it } from "vitest";

describe("Config tests", (): void => {
    it("should be disabled", async (): Promise<void> => {
        const log: Client<typeof SCHEMA_DEFAULT> = createClient({
            schema: SCHEMA_DEFAULT,
            config: {
                disable: 0,
                mute: 0,
            },
        });

        const result: string = log.info("hello", "world").toResult().log;

        expect(result).toBe("");
    });

    it("should be parsed by the parser", async (): Promise<void> => {
        const log: Client<typeof SCHEMA_DEFAULT> = createClient({
            schema: SCHEMA_DEFAULT,
            config: {
                mute: 0,
                parser: (): string => "abc",
            },
        });

        const result: string = log.info("hello", "world").toResult().content;

        const hvMsg: boolean = result.includes("abc");

        expect(hvMsg).toBe(true);
    });

    it("should have custom format", async (): Promise<void> => {
        const log: Client<typeof SCHEMA_DEFAULT> = createClient({
            schema: SCHEMA_DEFAULT,
            config: {
                mute: 0,
                format: (): string => "abc",
            },
        });

        const result: string = log.info("hello", "world").toResult().log;

        const hvMsg: boolean = result.includes("abc");

        expect(hvMsg).toBe(true);
    });

    it("should have trigger onDone function", async (): Promise<void> => {
        let isTriggered: boolean = false;

        const log: Client<typeof SCHEMA_DEFAULT> = createClient({
            schema: SCHEMA_DEFAULT,
            config: {
                mute: 0,
                onDone: () => {
                    isTriggered = true;
                },
            },
        });

        log.info("hello", "world");

        expect(isTriggered).toBe(true);
    });

    it("should have trigger onTrigger function", async (): Promise<void> => {
        let isTriggered: boolean = false;

        const log: Client<typeof SCHEMA_DEFAULT> = createClient({
            schema: SCHEMA_DEFAULT,
            config: {
                mute: 0,
                onTrigger: () => {
                    isTriggered = true;
                },
            },
        });

        await log.info("hello", "world").trigger();

        expect(isTriggered).toBe(true);
    });
});
