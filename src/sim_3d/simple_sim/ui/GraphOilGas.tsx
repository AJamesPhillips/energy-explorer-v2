
import { OilGasByYear } from "../../data/fossil_fuels/process_data_component"
import { Graph, GraphProps } from "./Graph"
import "./Graph.css"


interface GraphOilGasProps
{
    oil_gas_by_year: OilGasByYear
}
export function GraphOilGas(props: GraphOilGasProps)
{
    const { oil_gas_by_year } = props

    const graph_props: GraphProps<("oil_reserves" | "gas_reserves")[]> = {
        graph_title: "Oil & Gas",
        data_source_name: "oil_and_gas_reserves",

        data_by_year: oil_gas_by_year,
        colour_by_series: {
            oil_reserves: "#e07020",
            gas_reserves: "#2a7ae4",
        },
        year: 2020,
    }

    return <Graph {...graph_props} />
}
