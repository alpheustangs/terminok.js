[terminok](../README.md) / createClient

# Function: createClient()

> **createClient**\<`ClientSchema`, `LogKey`\>(`options`): [`Client`](../type-aliases/Client.md)\<`ClientSchema`\>

This function creates a client with the given options.

### Example

```ts
import type { Client } from "terminok";
import { createClient, SCHEMA_DEFAULT } from "terminok";

const log: Client<typeof SCHEMA_DEFAULT> = createClient({
    schema: SCHEMA_DEFAULT,
});

log.info("Hello");
```

## Type Parameters

• **ClientSchema** *extends* readonly `Format`\<`SchemaLogConfigBase` & `Partial`\<`SchemaLogConfigOptional`\>\>[]

• **LogKey** *extends* `string` = `ClientSchema`\[`number`\]\[`"key"`\]

## Parameters

• **options**

• **options.config?**: `Format`\<`Partial`\<`ConfigBase`\> & `object`\>

The config to be used.

#### Example

```ts
import type { Client, Config } from "terminok";
import { createClient, SCHEMA_DEFAULT } from "terminok";

const customConfig: Config = {
    enable: process.env.NODE_ENV === "development",
    timeZone: "utc",
};

const log: Client<typeof SCHEMA_DEFAULT> = createClient({
    config: customConfig,
    schema: SCHEMA_DEFAULT,
});

log.info("Hello");
```

• **options.schema?**: `ClientSchema`

The schema to be used.
If not specified, nothing will be returned.
To use the default schema, import `SCHEMA_DEFAULT`.

#### Example

This example creates a client with the default schema.

```ts
import type { Client } from "terminok";
import { createClient, SCHEMA_DEFAULT } from "terminok";

const log: Client<typeof SCHEMA_DEFAULT> = createClient({
    schema: SCHEMA_DEFAULT,
});

log.info("Hello");
```

This example creates a client with the custom schema.

```ts
import type { Client, Schema } from "terminok";
import { createClient, COLORS } from "terminok";

const customSchema = [
    {
        key: "ping",
        color: COLORS.red,
    }
] as const satisfies Schema;

const log: Client<typeof schema> = createClient({
    schema: customSchema,
});

log.ping("pong");
```

• **options.typesafe?**: `boolean`

Whether to validate the config and schema.
Set it to `false` if using TypeScript
and tend to improve the performance
by **NOT** validating both config and schema.

**Default**

```ts
true
```

## Returns

[`Client`](../type-aliases/Client.md)\<`ClientSchema`\>

## Defined in

[base/main.ts:85](https://github.com/alpheustangs/terminok.js/blob/7461d553f32c23ceb880b8aec4d89b0bfe7368bb/package/src/base/main.ts#L85)
