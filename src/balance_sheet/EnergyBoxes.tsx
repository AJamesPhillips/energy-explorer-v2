import { format_number_to_significant_figures } from "core/data/format/format_number_to_significant_figures"

import { EnergyFactor } from "../data/interface"
import "./EnergyBoxes.css"


export function EnergyBoxes(props: { factors: EnergyFactor[] })
{
    // Display each factor as a box of the appropriate height.
    const sinks = props.factors.filter(f => f.type === "sink").reverse()
    const sources = props.factors.filter(f => f.type !== "sink").reverse()

    return <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexDirection: "row" }}>
        <div style={{ display: "flex", justifyContent: "end", flexDirection: "column" }}>
            {sinks.map(factor => <FactorToBox
                key={factor.name}
                factor={factor}
            />)}
        </div>

        <div style={{ display: "flex", justifyContent: "end", flexDirection: "column" }}>
            {sources.map(factor => <FactorToBox
                key={factor.name}
                factor={factor}
            />)}
        </div>
    </div>
}


interface EnergyBoxStackProps
{
    key: number
    name: string
    total_kwh_per_day_person: number | undefined
    URL: string
    factors: EnergyFactor[]
    is_comparison: boolean
}
export function EnergyBoxStack(props: EnergyBoxStackProps)
{
    return <div className="energy_box_stack">
        <a
            className="energy_box_stack_header"
            href={props.URL}
            target="_blank"
            rel="noopener noreferrer"
        >
            <div className="energy_box_stack_subtitle">{props.name}</div>
            <div className="energy_box_stack_title">{props.total_kwh_per_day_person} kWh/d/p</div>
        </a>
        <div style={{ display: "flex", justifyContent: "end", flexDirection: "column" }}>
            {props.factors.map(factor => <FactorToBox
                key={factor.name}
                factor={factor}
                is_comparison={props.is_comparison}
            />)}
            <a
            className="energy_box_stack_footer"
                href={props.URL}
                target="_blank"
                rel="noopener noreferrer"
            >
                <div className="energy_box_stack_title">{props.total_kwh_per_day_person} kWh/d/p</div>
                <div className="energy_box_stack_subtitle">{props.name}</div>
            </a>
        </div>
    </div>
}



const factor_wrap_style: React.CSSProperties = {
    display: "flex",
    height: "100%",
    justifyContent: "center",
    padding: 8,
}
const hf = 5

function FactorToBox(props: { key: string, factor: EnergyFactor, is_comparison?: boolean })
{
    const { factor } = props

    const height = factor.error ? 10 : factor.kWh_per_day_per_person

    const background_color = factor.error ? "lightgray"
        : factor.type === "sink" ? "rgb(255, 220, 220)"
        : factor.type === "source" ? "lightgreen"
        : "rgb(230, 255, 230)"

    return <div
        title={factor.error}
        style={{
            height: height * hf,
            border: "thin solid " + (factor.error ? "black" : (factor.type === "sink" ? "red" : "green")),
            backgroundColor: background_color,
            width: 150,
        }}
    >
        {factor.link
            ? <a
                href={factor.link}
                target="_blank"
                rel="noopener noreferrer"
                style={factor_wrap_style}
            >
                <FactorToText factor={factor} is_comparison={props.is_comparison} />
            </a>
            : <FactorToText factor={factor} is_comparison={props.is_comparison} />}
    </div>
}


function FactorToText(props: { factor: EnergyFactor, is_comparison?: boolean })
{
    const { factor, is_comparison } = props

    return <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        textAlign: "center",
        fontSize: factor.font_size,
    }}>
        {factor.name}:
        <b>{format_number_to_significant_figures(factor.kWh_per_day_per_person, 2)} kWh/d/p</b>
        {is_comparison && factor.alternative_kWh_per_day_per_person}
    </div>
}
