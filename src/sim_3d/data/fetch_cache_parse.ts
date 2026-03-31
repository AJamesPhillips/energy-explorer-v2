import { DataSeries } from "core/data/values/DataSeries"
import {
    DatetimeRangeLatLonKey,
    DatetimeRangeLatLonMultipleKeys,
    factory_IndexManager_for_datetime_range_lat_lon,
} from "core/data/values/datetime_lat_lon"
import { LatLon, LatLonDataSeries } from "core/data/values/LatLon"


import { log_time } from "../utils/log_time"
import { datetime_range_2018 } from "./_2018"


export async function get_temporal_spatial_capacity_factor_data_from_csv_url(url: string): Promise<DataSeries<DatetimeRangeLatLonKey, number, DatetimeRangeLatLonMultipleKeys>>
{
    if (url.startsWith("https://raw.githubusercontent.com/") && location.hostname === "localhost")
    {
        // If running on localhost, rewrite the URL to use the vite proxy
        url = url.replace("https://raw.githubusercontent.com/", "/github/")
    }

    const response = await get_raw_data_from_url(url)
    if (response.error !== null) throw response.error

    const values: number[] = []
    const date_timestamps: number[] = []
    let lat_lon_data_series: LatLonDataSeries

    const lines = response.data.split("\n")
    log_time(`Finished fetching data from URL ${url}.  Now parsing ${lines.length} lines...`)
    for (const line of lines)
    {
        if (line.startsWith("#") || line.trim() === "") continue // skip comments and empty lines

        /* The solar and wind data have a non-standard format of:
        # A comment line
        "datetime","60.8333,-0.7697","60.5094,-1.1421","60.1915,-0.7534"
        1514764800,0,0,12
        1514768400,23,999,0
        */

        if (line.startsWith(`"datetime"`))
        {
            const [_datetime_label, ...lat_lon_strs] = line.split(`","`)

            const lat_lons = lat_lon_strs.map(lat_lon_str =>
            {
                const [lat_str, lon_str] = lat_lon_str.split(",")
                const lat_lon = new LatLon({
                    lat: parseFloat(lat_str!),
                    lon: parseFloat(lon_str!)
                })
                return lat_lon
            })
            lat_lon_data_series = new LatLonDataSeries(lat_lons)
            continue
        }

        const [date_seconds_str, ...value_strs] = line.split(",")
        const date_timestamp = parseInt(date_seconds_str!, 10) * 1000
        date_timestamps.push(date_timestamp)

        value_strs.forEach(value_str =>
        {
            const value = parseInt(value_str, 10) / 1000
            values.push(value)
        })
    }
    log_time(`Finished parsing ${lines.length} lines from ${url}.`)

    // Check dates match the datetime range
    const datetime_range_time_stamps = datetime_range_2018.get_time_stamps()
    if (!date_timestamps.every((ts, index) => ts === datetime_range_time_stamps[index]))
    {
        throw new Error(`Date timestamps from ${url} do not match the expected datetime range.  Expected: ${datetime_range_time_stamps.length}, got: ${date_timestamps.length}.  Make sure the data is for the year 2018 and has an hourly resolution.`)
    }

    const get_index = factory_IndexManager_for_datetime_range_lat_lon(datetime_range_2018, lat_lon_data_series!, true)
    return new DataSeries<DatetimeRangeLatLonKey, number, DatetimeRangeLatLonMultipleKeys>(values, get_index)
}


export type HttpDataOrError = {
    error: string
    data: null
} | {
    error: null
    data: string
}

export async function get_raw_data_from_url(url: string): Promise<HttpDataOrError>
{
    // First check if this > 20 Mb file is already cached locally in the browser
    const cached_data = await cache_get(url)
    if (cached_data)
    {
        console .debug(`   [CACHED] Using cached data for ${url}`)
        return { error: null, data: cached_data }
    }

    const response = await fetch(url)
    if (!response.ok) return { error: `Failed to fetch data from ${url}`, data: null }

    const data = await response.text()
    await cache_set(url, data)
    return { error: null, data }
}


async function cache_set(url: string, data: string): Promise<void>
{
    const cache = await window.caches.open("data-cache")
    const response = new Response(data, { headers: { "Content-Type": "text/plain" } })
    await cache.put(url, response)
}


async function cache_get(url: string): Promise<string | null>
{
    const cache = await window.caches.open("data-cache")
    const cached_response = await cache.match(url)
    if (cached_response) return await cached_response.text()
    return null
}
