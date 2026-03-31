import { LatLon } from "core/data/values/LatLon"

import { ILatLonWithIsOnshore } from "../../../src/model/interface"
import { get_raw_data_from_url, HttpDataOrError } from "../fetch_cache_parse"


class LatLonWithIsOnshore extends LatLon implements ILatLonWithIsOnshore
{
    is_onshore: boolean

    constructor(data: { lat: number, lon: number, is_onshore: boolean })
    {
        super({ lat: data.lat, lon: data.lon })
        this.is_onshore = data.is_onshore
    }
}


export async function get_spatial_data_grid(): Promise<{ onshore_lat_lons: ILatLonWithIsOnshore[], offshore_lat_lons: ILatLonWithIsOnshore[] }>
{
    const onshore_lat_lons = await get_onshore_lat_lons()
    const offshore_lat_lons = await get_offshore_lat_lons()
    return {
        onshore_lat_lons,
        offshore_lat_lons,
    }
}


export async function get_onshore_lat_lons(): Promise<ILatLonWithIsOnshore[]>
{
    const lat_lon_strs = await get_raw_data_from_url("/data/spatial_grid/onshore_lat_lons.csv")
    const lat_lons = process_lat_lon_strs(lat_lon_strs, true)
    return lat_lons
}


export async function get_offshore_lat_lons(): Promise<ILatLonWithIsOnshore[]>
{
    const lat_lon_strs = await get_raw_data_from_url("/data/spatial_grid/offshore_lat_lons.csv")
    const lat_lons = process_lat_lon_strs(lat_lon_strs, false)
    return lat_lons
}


function process_lat_lon_strs(lat_lon_strs: HttpDataOrError, is_onshore: boolean): ILatLonWithIsOnshore[]
{
    if (lat_lon_strs.error !== null) throw new Error(lat_lon_strs.error)

    const lat_lons: ILatLonWithIsOnshore[] = []

    lat_lon_strs.data
        .split("\n")
        .forEach(line =>
        {
            // Skip empty lines and comments
            if (line.trim() === "" || line.startsWith("#")) return

            const [lat_str, lon_str] = line.split(",")
            const lat_lon = new LatLonWithIsOnshore({
                lat: safe_parse_float(lat_str!),
                lon: safe_parse_float(lon_str!),
                is_onshore,
            })
            lat_lons.push(lat_lon)
        })

    return lat_lons
}


function safe_parse_float(value: string): number
{
    const parsed = parseFloat(value)
    if (isNaN(parsed)) throw new Error(`Failed to parse float from value: ${value}`)
    return parsed
}
