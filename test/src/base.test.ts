import type { Client } from "terminok";

import { SCHEMA_DEFAULT, createClient } from "terminok";
import { describe, expect, it } from "vitest";

describe("Basic tests", (): void => {
    const log: Client<typeof SCHEMA_DEFAULT> = createClient({
        schema: SCHEMA_DEFAULT,
        config: {
            mute: 0,
        },
    });

    it("should run without error", async (): Promise<void> => {
        const result: string = log.info("hello", "world").toResult().log;

        const haveTitle: boolean = result.includes("[info]");
        const haveMessage: boolean = result.includes("hello world");

        expect(haveTitle).toBe(true);
        expect(haveMessage).toBe(true);
    });

    it("should accept object, subObject and subArray", async (): Promise<void> => {
        const obj = {
            title: "hello",
            content: "world",
            sub: {
                hello: "world",
            },
            array: ["hello", "world"],
        };

        const result: string = log.info(obj).toResult().content;

        const hvObj: boolean = result.includes('{"hello":"world"}');
        const hvArr: boolean = result.includes('["hello","world"]');

        expect(hvObj).toBe(true);
        expect(hvArr).toBe(true);
    });

    it("should accept array, subArray, and subObject", async (): Promise<void> => {
        const arr = [
            {
                title: "hello",
                content: "world",
            },
            ["1", "2", 3],
        ];

        const result: string = log.info(arr).toResult().content;

        const hvObj: boolean = result.includes(
            '{"title":"hello","content":"world"}',
        );
        const hvArr: boolean = result.includes('["1","2",3]');

        expect(hvObj).toBe(true);
        expect(hvArr).toBe(true);
    });

    it("should accept function result", async (): Promise<void> => {
        const fn = (): string => "hello";

        const result: string = log.info(fn()).toResult().content;

        const hvStr: boolean = result.includes("hello");

        expect(hvStr).toBe(true);
    });

    it("should accept async function result", async (): Promise<void> => {
        const fn = async (): Promise<string> => "hello";

        const result: string = log.info(await fn()).toResult().content;

        const hvStr: boolean = result.includes("hello");

        expect(hvStr).toBe(true);
    });
});
