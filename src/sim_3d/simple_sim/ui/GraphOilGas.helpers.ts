import { DataPoint, OilGasByYear } from "../../data/fossil_fuels/process_data_component"


export type ProductionFieldsTuple = ["oil_production", "gas_production"]
export type OilGasDataByYear<Fields extends string[]> = Record<number, {[f in Fields[number]]: DataPoint}>

export function get_oil_gas_production_by_year(oil_gas_by_year: OilGasByYear): OilGasDataByYear<ProductionFieldsTuple>
{
    const production_by_year: OilGasDataByYear<ProductionFieldsTuple> = {}
    const all_years = Object.keys(oil_gas_by_year).map(Number).sort((a, b) => a - b)

    let previous_oil_cumulative: number | undefined
    let previous_gas_cumulative: number | undefined
    let previous_oil_is_projected = false
    let previous_gas_is_projected = false
    all_years.forEach(year =>
    {
        const row = oil_gas_by_year[year]
        if (!row) return
        const current_oil_cumulative = row.cumulative_oil_production.value
        const current_gas_cumulative = row.cumulative_gas_production.value

        const oil_production = (
            current_oil_cumulative !== undefined &&
            previous_oil_cumulative !== undefined
        )
            ? current_oil_cumulative - previous_oil_cumulative
            : undefined
        const gas_production = (
            current_gas_cumulative !== undefined &&
            previous_gas_cumulative !== undefined
        )
            ? current_gas_cumulative - previous_gas_cumulative
            : undefined
        const oil_is_projected = Boolean(row.cumulative_oil_production.is_projected && previous_oil_is_projected)
        const gas_is_projected = Boolean(row.cumulative_gas_production.is_projected && previous_gas_is_projected)

        production_by_year[year] = {
            oil_production: { value: oil_production, is_projected: oil_is_projected },
            gas_production: { value: gas_production, is_projected: gas_is_projected },
        }

        previous_oil_cumulative = current_oil_cumulative ?? previous_oil_cumulative
        previous_gas_cumulative = current_gas_cumulative ?? previous_gas_cumulative
        previous_oil_is_projected = Boolean(row.cumulative_oil_production.is_projected)
        previous_gas_is_projected = Boolean(row.cumulative_gas_production.is_projected)
    })

    return production_by_year
}
