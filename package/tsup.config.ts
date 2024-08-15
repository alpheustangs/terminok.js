import { defineConfig } from "tsup";

export default defineConfig([
    {
        minify: true,
        platform: "neutral",
        format: "esm",
        tsconfig: "./tsconfig.esm.json",
        entry: {
            index: "./src/index.ts",
        },
        outDir: "./dist",
    },
    {
        dts: true,
        minify: true,
        platform: "neutral",
        format: "cjs",
        tsconfig: "./tsconfig.cjs.json",
        entry: {
            index: "./src/index.ts",
        },
        outDir: "./dist",
    },
]);
