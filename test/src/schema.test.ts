import type { Client, Schema } from "terminok";

import { createClient } from "terminok";
import { describe, expect, it } from "vitest";

describe("Schema tests", (): void => {
    it("should accept schema", async (): Promise<void> => {
        const schema = [
            {
                key: "ping",
            },
        ] as const satisfies Schema;

        const log: Client<typeof schema> = createClient({
            config: {
                mute: 0,
            },
            schema,
        });

        const result: string = log.ping("pong").toResult().log;
        const hvPing: boolean = result.includes("[ping]");
        const hvPong: boolean = result.includes("pong");

        expect(hvPing).toBe(true);
        expect(hvPong).toBe(true);
    });

    it("should accept log with title", async (): Promise<void> => {
        const schema = [
            {
                key: "ping",
                title: "PIN",
            },
        ] as const satisfies Schema;

        const log: Client<typeof schema> = createClient({
            config: {
                mute: 0,
            },
            schema,
        });

        const result: string = log.ping("pong").toResult().log;
        const hvPing: boolean = result.includes("[PIN]");

        expect(hvPing).toBe(true);
    });

    it("should have trigger onDone function", async (): Promise<void> => {
        let number: string = "0";

        const schema = [
            {
                key: "ping",
                title: "PIN",
                onDone: (): void => {
                    number = "2";
                },
            },
        ] as const satisfies Schema;

        const log: Client<typeof schema> = createClient({
            config: {
                mute: 0,
                onDone: (): void => {
                    number = "1";
                },
            },
            schema,
        });

        log.ping("pong");

        expect(number).toBe("2");
    });

    it("should have trigger onTrigger function", async (): Promise<void> => {
        let number: string = "0";

        const schema = [
            {
                key: "ping",
                title: "PIN",
                onTrigger: (): void => {
                    number = "2";
                },
            },
        ] as const satisfies Schema;

        const log: Client<typeof schema> = createClient({
            config: {
                mute: 0,
                onTrigger: (): void => {
                    number = "1";
                },
            },
            schema,
        });

        await log.ping("pong").trigger();

        expect(number).toBe("2");
    });
});
