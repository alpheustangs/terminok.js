import type {
    Config,
    FormatData,
    OutputConfig,
    OutputFunctionOptions,
    TimeZone,
} from "#/@types/config";
import type {
    Client,
    ExtraFunctionOptions,
    Schema,
    SchemaLogConfig,
} from "#/base/main";
import type { Log, LogResult } from "#/functions/log";
import type { Color, Colors } from "#/utils/color";

import { createClient } from "#/base/main";
import { SCHEMA_DEFAULT } from "#/configs/schema";
import { COLORS } from "#/utils/color";

export type {
    // types
    TimeZone,
    FormatData,
    OutputFunctionOptions,
    OutputConfig,
    Config,
    // base
    Client,
    Schema,
    SchemaLogConfig,
    ExtraFunctionOptions,
    // log
    Log,
    LogResult,
    // color
    Colors,
    Color,
};

export {
    // functions
    createClient,
    // variables
    SCHEMA_DEFAULT,
    COLORS,
};
