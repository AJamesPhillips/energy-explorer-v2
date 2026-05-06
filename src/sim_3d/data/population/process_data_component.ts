import { DataComponentExtended } from "../../../data/interface"


export type PopulationByYear = Record<number, { value: number, is_projected?: boolean }>


export function process_uk_population_data_component(component: DataComponentExtended): PopulationByYear
{
    const data = JSON.parse(component.computed_value!)
    const population_by_year_raw: Record<number, number> = Object.fromEntries(data)
    const population_by_year: PopulationByYear = {}
    Object.entries(population_by_year_raw).forEach(([year_str, value]) =>
    {
        const year = Number(year_str)
        population_by_year[year] = { value }
    })

    const known_years = Object.keys(population_by_year).map(Number).sort((a, b) => a - b)

    // Project next N years from the last two known data points
    const project_next_n_years = 10

    if (known_years.length > 2)
    {
        const last = known_years[known_years.length - 1]!
        const second_last = known_years[known_years.length - 2]!
        const last_pop = population_by_year[last]!
        const second_last_pop = population_by_year[second_last]!
        const rate = (last_pop.value - second_last_pop.value) / (last - second_last) // per year

        for (let y = last + 1; y <= last + project_next_n_years; y++)
        {
            const value = last_pop.value + rate * (y - last)
            population_by_year[y] = { value, is_projected: true }
        }
    }

    return population_by_year
}
