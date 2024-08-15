import type { TimeZone } from "#/@types/config";

type GetTimeOptions = {
    timeZone: TimeZone;
};

const patch = (val: number, add: number): string => {
    return val.toString().padStart(add, "0");
};

const getNow = (options: GetTimeOptions): Date => {
    const now: Date = new Date();
    const utc: number = now.getTime() + now.getTimezoneOffset() * 60000;

    switch (options.timeZone) {
        case "utc":
            return new Date(utc);
        case "local":
            return now;
        default: {
            const target: number = utc + options.timeZone * 60000;
            return new Date(target);
        }
    }
};

type TimeData = {
    year: string;
    month: string;
    day: string;
    hour: string;
    minute: string;
    second: string;
    millisecond: string;
};

const getTimeData = (options: GetTimeOptions): TimeData => {
    const now: Date = getNow(options);

    return {
        year: now.getFullYear().toString(),
        month: patch(now.getMonth() + 1, 2),
        day: patch(now.getDate(), 2),
        hour: patch(now.getHours(), 2),
        minute: patch(now.getMinutes(), 2),
        second: patch(now.getSeconds(), 2),
        millisecond: patch(now.getMilliseconds(), 3),
    };
};

const getTime = (timeData: TimeData): string => {
    return (
        // biome-ignore lint/style/useTemplate: readability
        timeData.year +
        "/" +
        timeData.month +
        "/" +
        timeData.day +
        " " +
        timeData.hour +
        ":" +
        timeData.minute +
        ":" +
        timeData.second +
        ":" +
        timeData.millisecond
    );
};

export type { GetTimeOptions, TimeData };
export { getTimeData, getTime };
