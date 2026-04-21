import { DataComponent } from "core/data/interface"
import { Graph } from "core/data/utils/graph"

import { PerspectiveType } from "../components/SelectPerspective"


export interface DataComponentExtended extends DataComponent
{
    computed_value: string | undefined
    multiple_versions: { latest_version: number } | undefined
}

export type GraphWithComputedValues = Graph<DataComponentExtended>


export type EnergyFactorName = (
    "Car" |
    "Jet flights" |
    "Heating, cooling" |
    "Light" |
    "Gadgets" |
    "Food, farming, fertiliser" |
    "Stuff" |
    "Transporting stuff" |
    "Defence" |

    "Onshore wind" |
    "Solar heating" |
    "PV residential" |
    "PV farm" |
    "Biomass: food, biofuel, wood, waste incineration, landfill gas" |
    "Hydroelectricity" |
    "Shallow offshore wind" |
    "Deep offshore wind" |
    "Wave" |
    "Tide" |
    "Geothermal"
)

export interface EnergyFactor
{
    name: EnergyFactorName
    font_size: number
    order: number
    kWh_per_day_per_person: number
    alternative_kWh_per_day_per_person?: number
    type: "sink" | "source" | "weak_source"
    link: string
    error?: string
}


export interface PerspectiveKnowledgeGraph
{
    id: PerspectiveType
    graph: GraphWithComputedValues
    sinks: EnergyFactor[]
    sources: EnergyFactor[]
}
