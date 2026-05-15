import { DataComponentExtended } from "../../../data/interface"
import { DataPoint } from "../interface"


interface DataRow
{
    total_area_km2: DataPoint
}
export type SolarFarmsByYear = Record<number, DataRow>
export type SolarFarmsDataByYear<Fields extends string[]> = Record<number, {[f in Fields[number]]: DataPoint}>


export function process_solar_farms_data_component(component: DataComponentExtended): SolarFarmsByYear
{
    const { data } = JSON.parse(component.computed_value!) as { data: [number, Record<string, number>][] }
    const oil_gas_by_year_raw: SolarFarmsByYear = {}

    data.forEach(row =>
    {
        const year = row[0]
        const total_area_km2 = row[1]["total area (km^2)"]

        const values: DataRow = {
            total_area_km2: { value: total_area_km2 },
        }

        oil_gas_by_year_raw[year] = values
    })

    return oil_gas_by_year_raw
}
