import { DataComponentExtended } from "../../../data/interface"


export interface DataPoint
{
    value: number | undefined
    is_projected?: boolean
}
interface DataRow
{
    oil_reserves: DataPoint
    gas_reserves: DataPoint
    cumulative_oil_production: DataPoint
    cumulative_gas_production: DataPoint
}
export type OilGasByYear = Record<number, DataRow>

export const DATA_UNTIL_YEAR = 2024
export const PROJECTION_UNTIL_YEAR = 2031

export function process_uk_oil_gas_data_component(component: DataComponentExtended): OilGasByYear
{
    const { data } = JSON.parse(component.computed_value!) as { data: [number, Record<string, number>][] }
    const oil_gas_by_year_raw: OilGasByYear = {}

    data.forEach(row =>
    {
        const year = row[0]
        const oil_reserves = row[1]["Oil Reserves"]
        const gas_reserves = row[1]["Gas Reserves"]
        const cumulative_oil_production = row[1]["Cumulative Oil Production"]
        const cumulative_gas_production = row[1]["Cumulative Net Gas Production"]

        const is_projected = year > DATA_UNTIL_YEAR

        const values: DataRow = {
            oil_reserves: { value: oil_reserves, is_projected },
            gas_reserves: { value: gas_reserves, is_projected },
            cumulative_oil_production: { value: cumulative_oil_production, is_projected },
            cumulative_gas_production: { value: cumulative_gas_production, is_projected },
        }

        oil_gas_by_year_raw[year] = values
    })

    return oil_gas_by_year_raw
}
