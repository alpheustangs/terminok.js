# Terminok

A terminal logging solution.

Terminok is a logging solution that outputs colorful logs to the terminal or saves them to a file. It supports both web and Node environments, with additional runtime compatibility based on the configuration.

## Installation

Install this package as a dependency in the project:

```sh
# npm
npm i terminok

# Yarn
yarn add terminok

# pnpm
pnpm add terminok
```

## Quick Start

Create a client with default schema as follows:

```ts
import type { Client } from "terminok";
import { createClient, SCHEMA_DEFAULT } from "terminok";

const log: Client<typeof SCHEMA_DEFAULT> = createClient({
    schema: SCHEMA_DEFAULT,
});

log.info("Hello");
```

Or create a custom schema with the following code:

```ts
import type { Client, Schema } from "terminok";
import { createClient, COLORS } from "terminok";

const customSchema = [
    {
        key: "ping",
        color: COLORS.red,
    }
] as const satisfies Schema;

const log: Client<typeof customSchema> = createClient({
    schema: customSchema,
});

log.ping("pong");
```

## Documentation

For more information, please refer to the [documentation](./docs/README.md).

## What If

Terminok provides a highly customizable config and schema, so you can create your own logger easily. But you may meet some problems during the creation.

### What If the Schema Is Empty

If the schema is empty, it will return nothing as a result. So you should import the default schema or create your own schema.

```ts
import { createClient } from "terminok";

const log = createClient();

// Nothing will be inside `log`
```

### What If I Want to Customize How the Log Will Be Displayed

To customize how the log will be displayed, you may edit `format` parameter in config to customize the output.

```ts
import type { Client, FormatData } from "terminok";
import { createClient, SCHEMA_DEFAULT } from "terminok";

const log: Client<typeof SCHEMA_DEFAULT> = createClient({
    schema: SCHEMA_DEFAULT,
    config: {
        format: (data: FormatData) => {
            return `- [${data.title}] ${data.content}`;
        },
    }
});

log.info("Hello");
```

### What If I Set `onDone`/`onTrigger` Config on Both Config and Schema

If you set `onDone`/`onTrigger` on both config and schema, both of them will be executed. And the `onDone`/`onTrigger` function in `config` will be executed first.

```ts
import type { Client, Schema } from "terminok";
import { createClient, COLORS } from "terminok";

const customSchema = [
    {
        key: "ping",
        color: COLORS.red,
        onDone: (): void => {
            // executed second
        }
    },
] as const satisfies Schema;

const log: Client<typeof customSchema> = createClient({
    schema: customSchema,
    config: {
        onDone: (): void => {
            // executed first
        }
    }
});
```

### What If I Set `output` Config on Both `config` and `schema`

If you set `output` on both config and schema, the `output` config in `config` will be overrided by the `output` config in `schema`.

```ts
import type { Client, Schema } from "terminok";
import { createClient, COLORS } from "terminok";

const customSchema = [
    {
        key: "ping",
        color: COLORS.red,
    },
    {
        key: "ping2",
        color: COLORS.red,
        output: {
            // ...
        }
    }
] as const satisfies Schema;

const log: Client<typeof customSchema> = createClient({
    schema: customSchema,
    config: {
        output: {
            // ...
        }
    }
});

await log.ping("pong").toFile(); // run with config `output` settings 
await log.ping2("pong").toFile(); // run with schema `output` settings
```

### What If the `toFile()` Function Triggered in Web

While Terminok supports both web and Node.js environments, the `toFile()` function is exclusive for Node.js environments by default. Using `toFile()` in web will lead to an error.

```ts
import type { Client } from "terminok";
import { createClient, SCHEMA_DEFAULT } from "terminok";

const log: Client<typeof SCHEMA_DEFAULT> = createClient({
    schema: SCHEMA_DEFAULT,
});

await log.info("Hello").toFile();

// This will lead to an error in web with default config
```

## License

This project is licensed under the terms of the MIT license.
