import { TemporalSpatialDataSeries } from "../../../../src/model/interface"
import { get_temporal_spatial_capacity_factor_data_from_csv_url } from "../../fetch_cache_parse"


export async function uk_hourly_capacity_factor_onshore_wind_generation_2018(): Promise<TemporalSpatialDataSeries>
{
    return await get_temporal_spatial_capacity_factor_data_from_csv_url("https://raw.githubusercontent.com/TheWorldSim/world-sim-data/refs/heads/master/data/wind_turbine_capacity/data/_2018_united_kingdom_80_Vestas_V90_2000%40core%400.0.10.csv")
}


export async function uk_hourly_capacity_factor_offshore_wind_generation_2018(): Promise<TemporalSpatialDataSeries>
{
    return await get_temporal_spatial_capacity_factor_data_from_csv_url("https://raw.githubusercontent.com/TheWorldSim/world-sim-data/refs/heads/master/data/wind_turbine_capacity/data/_2018_united_kingdom__offshore_80_Vestas_V90_2000%40core%400.0.10.csv")
}


export async function uk_hourly_capacity_factor_wind_generation_2018(): Promise<{ onshore: TemporalSpatialDataSeries, offshore: TemporalSpatialDataSeries }>
{
    const onshore = await uk_hourly_capacity_factor_onshore_wind_generation_2018()
    const offshore = await uk_hourly_capacity_factor_offshore_wind_generation_2018()

    // const combined: IDataSeries<DatetimeRangeLatLonKey, number, DatetimeRangeLatLonMultipleKeys> = combine_data_series([
    //     onshore,
    //     offshore,
    // ])

    return {
        onshore,
        offshore,
    }
}
