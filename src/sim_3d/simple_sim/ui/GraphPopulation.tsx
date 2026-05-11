
import { PopulationByYear } from "../../data/population/process_data_component"
import { format_value_to_string } from "./format_value_to_string"
import { Graph, GraphProps } from "./Graph"
import "./Graph.css"


interface GraphPopulationProps
{
    population_by_year: PopulationByYear
    year: number
    population: number
    set_population: (population: number) => void
}
export function GraphPopulation(props: GraphPopulationProps)
{
    const graph_props: GraphProps<("population")[]> = {
        graph_title: "Population",
        data_source_name: "population",

        year: props.year,
        data_by_year: props.population_by_year,
        colour_by_series: {
            population: "#2a7ae4",
        },
        get_values_description: (_, values) => ({
            description: format_value_to_string(values.population.value!),
            is_projected: !!values.population.is_projected,
        }),
        on_change: (_, values) =>
        {
            const population = values.population.value
            if (population === undefined) return
            props.set_population(population)
        },
    }

    return <Graph {...graph_props as any} />
}
