import { DataSeries } from "core/data/values/DataSeries"
import { DatetimeRangeLatLonKey, DatetimeRangeLatLonMultipleKeys } from "core/data/values/datetime_lat_lon"

import { log_time } from "../../../utils/log_time"
import { get_temporal_spatial_capacity_factor_data_from_csv_url } from "../../fetch_cache_parse"


export async function uk_hourly_capacity_factor_solar_generation_2018(): Promise<DataSeries<DatetimeRangeLatLonKey, number, DatetimeRangeLatLonMultipleKeys>>
{
    log_time("Start loading UK solar generation data for 2018")
    const response = await get_temporal_spatial_capacity_factor_data_from_csv_url({
        // datetime_range: datetime_range_2018_month_hourly,
        url: "https://raw.githubusercontent.com/TheWorldSim/world-sim-data/refs/heads/master/data/solarpv_capacity/data/_2018_united_kingdom_loss10percent_tracking1_tilt35_azim180%40core%400.0.10.csv"
    })
    log_time("Finished loading UK solar generation data for 2018")
    return response
}


export async function uk_month_hourly_and_location_average_capacity_factor_solar_generation_2018(): Promise<DataSeries<DatetimeRangeLatLonKey, number, DatetimeRangeLatLonMultipleKeys>>
{
    log_time("Start loading UK month hourly and location average solar generation data for 2018")
    const response = await get_temporal_spatial_capacity_factor_data_from_csv_url({
        // datetime_range: datetime_range_2018_month_hourly,
        url: "https://raw.githubusercontent.com/TheWorldSim/world-sim-data/refs/heads/master/data/solarpv_capacity_summary/data/_2018_united_kingdom_loss10percent_tracking1_tilt35_azim180_month_hourly_and_location_average@core@0.0.10.csv"
    })
    log_time("Finished loading UK month hourly and location average solar generation data for 2018")
    return response
}

// export async function uk_hourly_capacity_factor_solar_generation_2018_v2(): Promise<DataSeries<DatetimeRangeLatLonKey, number, DatetimeRangeLatLonMultipleKeys>>
// {
//     log_time("Start loading UK solar generation data for 2018 v2. Loading onshore lat/lon data")
//     const onshore_lat_lons = await get_onshore_lat_lons()
//     // datetime_range_2018
//     log_time("Onshore lat/lon data loaded.  Fetching solar generation data")
//     const response = await get_temporal_spatial_capacity_factor_data_from_csv_url("https://raw.githubusercontent.com/TheWorldSim/world-sim-data/refs/heads/master/data/solarpv_capacity/data/_2018_united_kingdom_loss10percent_tracking1_tilt35_azim180%40core%400.0.10.csv")
//     log_time("Solar generation data fetched and parsed")
//     return response
// }
