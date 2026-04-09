import { DatetimeRange } from "core/data/values/DatetimeRange"



export const datetime_range_2018_hourly = new DatetimeRange({
    start: new Date("2018-01-01T00:00:00.000Z"),
    end: new Date("2019-01-01T00:00:00.000Z"),
    repeat_every: "hour",
})

// export const datetime_range_2018_month_hourly = new DatetimeRange({
//     start: new Date("2018-01-01T00:00:00.000Z"),
//     end: new Date("2019-01-01T00:00:00.000Z"),
//     averaged_over: "month",
//     repeat_every: "hour",
// })
