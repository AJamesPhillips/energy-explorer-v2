
import { DATA_UNTIL_YEAR, DataPoint, OilGasByYear } from "../../data/fossil_fuels/process_data_component"
import pub_sub from "../../state/pub_sub"
import { Graph, GraphProps } from "./Graph"
import "./Graph.css"


interface GraphOilGasProps
{
    year: number
    oil_gas_by_year: OilGasByYear
}

const OIL_COLOUR = "#e07020"
const GAS_COLOUR = "#2a7ae4"

type ReservesFieldsTuple = ["oil_reserves", "gas_reserves", "cumulative_oil_production", "cumulative_gas_production"]
type ProductionFieldsTuple = ["oil_production", "gas_production"]
type OilGasDataByYear<Fields extends string[]> = Record<number, {[f in Fields[number]]: DataPoint}>

function get_oil_gas_description(oil: number | undefined, gas: number | undefined)
{
    return <>
        <span style={{ color: OIL_COLOUR }}>Oil</span>: {oil ?? "n/a"}{" "}
        <span style={{ color: GAS_COLOUR }}>Gas</span>: {gas ?? "n/a"}
    </>
}

function create_oil_gas_graph_props<Fields extends string[]>(args: {
    graph_title: string
    year: number
    data_by_year: OilGasDataByYear<Fields>
    colour_by_series: {[f in Fields[number]]: string | false}
    get_oil_value: (values: {[f in Fields[number]]: DataPoint}) => number | undefined
    get_gas_value: (values: {[f in Fields[number]]: DataPoint}) => number | undefined
    is_projected: (year: number, values: {[f in Fields[number]]: DataPoint}) => boolean
}): GraphProps<Fields>
{
    return {
        graph_title: args.graph_title,
        data_source_name: "oil_and_gas_reserves",

        year: args.year,
        data_by_year: args.data_by_year,
        colour_by_series: args.colour_by_series,
        get_values_description: (year, values) =>
        {
            const description = get_oil_gas_description(
                args.get_oil_value(values),
                args.get_gas_value(values),
            )
            const is_projected = args.is_projected(year, values)
            return { description, is_projected }
        },
    }
}

function get_oil_gas_production_by_year(oil_gas_by_year: OilGasByYear): OilGasDataByYear<ProductionFieldsTuple>
{
    const production_by_year: OilGasDataByYear<ProductionFieldsTuple> = {}
    const all_years = Object.keys(oil_gas_by_year).map(Number).sort((a, b) => a - b)

    let previous_oil_cumulative: number | undefined
    let previous_gas_cumulative: number | undefined
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

        production_by_year[year] = {
            oil_production: { value: oil_production, is_projected: row.cumulative_oil_production.is_projected },
            gas_production: { value: gas_production, is_projected: row.cumulative_gas_production.is_projected },
        }

        previous_oil_cumulative = current_oil_cumulative ?? previous_oil_cumulative
        previous_gas_cumulative = current_gas_cumulative ?? previous_gas_cumulative
    })

    return production_by_year
}

function GraphOilGasBlank(props: { graph_title: string, message: string })
{
    return <div className="data_graph ui_info_box">
        <div className="ui_info_box_header">
            <span
                className="source_info_label"
                onClick={() => pub_sub.pub("show_info_and_data_sources", "oil_and_gas_reserves")}
            >
                {props.graph_title} <span className="source_info_link">(source)</span>
            </span>

            <span style={{ fontWeight: "bold", color: "#333" }}>
                {props.message}
            </span>
        </div>
        <div style={{ height: 120 }} />
    </div>
}

export function GraphOilGasReserves(props: GraphOilGasProps)
{
    const { oil_gas_by_year } = props

    const graph_props = create_oil_gas_graph_props<ReservesFieldsTuple>({
        graph_title: "Oil & Gas Reserves",
        year: props.year,
        data_by_year: oil_gas_by_year,
        colour_by_series: {
            oil_reserves: OIL_COLOUR,
            gas_reserves: GAS_COLOUR,
            cumulative_oil_production: false,
            cumulative_gas_production: false,
        },
        get_oil_value: values => values.oil_reserves.value,
        get_gas_value: values => values.gas_reserves.value,
        is_projected: year => year > DATA_UNTIL_YEAR,
    })

    return <Graph<ReservesFieldsTuple> {...graph_props} />
}

export function GraphOilGasResources()
{
    return <GraphOilGasBlank
        graph_title="Oil & Gas Resources"
        message="Awaiting data"
    />
}

export function GraphOilGasProduction(props: GraphOilGasProps)
{
    const production_by_year = get_oil_gas_production_by_year(props.oil_gas_by_year)
    const graph_props = create_oil_gas_graph_props<ProductionFieldsTuple>({
        graph_title: "Oil & Gas Annual Production",
        year: props.year,
        data_by_year: production_by_year,
        colour_by_series: {
            oil_production: OIL_COLOUR,
            gas_production: GAS_COLOUR,
        },
        get_oil_value: values => values.oil_production.value,
        get_gas_value: values => values.gas_production.value,
        is_projected: (year, values) =>
            values.oil_production.is_projected ?? values.gas_production.is_projected ?? year > DATA_UNTIL_YEAR,
    })

    return <Graph<ProductionFieldsTuple> {...graph_props} />
}
