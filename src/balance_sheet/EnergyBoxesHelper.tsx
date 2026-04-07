
import { IdOnly } from "core/data/id"
import { DataComponent } from "core/data/interface"
import { Graph, GraphNode } from "core/data/utils/graph"

import { map_factor_name_to_ido } from "../data/ids"
import { EnergyFactor, EnergyFactorName } from "../data/interface"



function all_factors(): EnergyFactor[]
{
    const ordered_factors_map: { [N in EnergyFactorName]: Pick<EnergyFactor, "type" | "font_size" | "order"> } = {
        "Car": { type: "sink", font_size: 14, order: 3 },
        "Jet flights": { type: "sink", font_size: 14, order: 5 },
        "Heating, cooling": { type: "sink", font_size: 14, order: 7 },
        "Light": { type: "sink", font_size: 14, order: 9 },
        "Gadgets": { type: "sink", font_size: 14, order: 11 },
        "Food, farming, fertiliser": { type: "sink", font_size: 14, order: 13 },
        "Stuff": { type: "sink", font_size: 14, order: 15 },
        "Transporting stuff": { type: "sink", font_size: 14, order: 15.1 },
        "Defence": { type: "sink", font_size: 14, order: 17 },

        "Onshore wind": { type: "source", font_size: 14, order: 4 },
        "Solar heating": { type: "weak_source", font_size: 14, order: 6 },
        "PV residential": { type: "source", font_size: 10, order: 6.1 },
        "PV farm": { type: "source", font_size: 14, order: 6.2 },
        "Biomass: food, biofuel, wood, waste incineration, landfill gas": { type: "source", font_size: 14, order: 6.3 },
        "Hydroelectricity": { type: "source", font_size: 10, order: 8 },
        "Shallow offshore wind": { type: "source", font_size: 14, order: 10 },
        "Deep offshore wind": { type: "source", font_size: 14, order: 10.1 },
        "Wave": { type: "source", font_size: 14, order: 12 },
        "Tide": { type: "source", font_size: 14, order: 14 },
        "Geothermal": { type: "source", font_size: 14, order: 16 },
    }

    const ordered_factors: EnergyFactor[] = Object.entries(ordered_factors_map)
        .map(([name, attributes]) => ({
            name: name as EnergyFactorName,
            ...attributes,
            kWh_per_day_per_person: 0,
            link: "",
        }))
        .sort((a, b) => a.order - b.order)

    return ordered_factors
}


function filter_factors_up_to(name: EnergyFactorName): EnergyFactor[]
{
    const factors = all_factors()
    const index = factors.findIndex(f => f.name === name)
    if (index === -1) throw new Error(`Unknown factor name ${name}`)
    return factors.slice(0, index + 1)
}


export function factors_up_to(name: EnergyFactorName, graph: Graph): EnergyFactor[]
{
    const factors = filter_factors_up_to(name)
        // .filter(factor => factor.name === "Heating, cooling")

    factors.forEach(factor =>
    {
        const id_only = map_factor_name_to_ido[factor.name]
        if (!id_only)
        {
            factor.error = `No component IdAndVersion for factor ${factor.name}`
            return
        }

        const mapped_entry_idv = graph.map_concept_ido_to_idv_of_interest[id_only.id]
        if (!mapped_entry_idv)
        {
            factor.error = `No entry in graph for IdOnly ${id_only.to_str()} (mapped id: ${mapped_entry_idv})`
            return
        }
        const entry = graph.nodes[mapped_entry_idv]

        let alternative_id_only: IdOnly | undefined
        let alternative_entry: GraphNode | undefined
        if (entry && entry.alternatives?.length)
        {
            const alternative_id = entry.alternatives[0]!
            alternative_id_only = alternative_id.as_IdOnly()
            alternative_entry = graph.nodes[alternative_id.to_str()]
        }

        // Set the factor.link to a general URL of the data component in case
        // the latest data component is not available to provide its version for the URL
        factor.link = (alternative_id_only || id_only).to_url()

        const data_component = entry?.component
        if (!data_component)
        {
            factor.error = `Data component not found for IdAndVersion ${id_only.to_str()}`
            return
        }

        // Update the factor.link with the versioned URL of the data component
        factor.link = data_component.id.to_url()

        const value = get_value(data_component, factor)
        if (factor.error) return

        factor.kWh_per_day_per_person = value

        if (alternative_entry)
        {
            const value = get_value(alternative_entry.component, factor)
            if (factor.error) return
            factor.alternative_kWh_per_day_per_person = value
        }
    })

    return factors
}


function get_value(data_component: DataComponent | undefined, factor: EnergyFactor): number
{
    const value = parseInt(data_component?.result_value || "")
    if (Number.isNaN(value))
    {
        factor.error = `Result value for component ${data_component?.id.to_str()} is not a number: ${data_component?.result_value}`
        return 0
    }

    return value
}
