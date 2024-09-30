# Terminok

A terminal logging solution. 

Terminok is a logging solution that outputs colorful logs to the terminal or saves them to a file. It supports both web and Node environments, with additional runtime compatibility based on your configuration.

## Quick Start

You may create a client with default schema as follows:

```typescript
import type { Client } from "terminok";
import { createClient, SCHEMA_DEFAULT } from "terminok";

const log: Client<typeof SCHEMA_DEFAULT> = createClient({
    schema: SCHEMA_DEFAULT,
});

log.info("Hello");
```

Or create your own schema with the following code:

```typescript
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

## License

This project is MIT licensed, you can find the license file [here](./LICENSE).
