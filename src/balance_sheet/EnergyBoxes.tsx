import { format_number_to_significant_figures } from "core/data/format/format_number_to_significant_figures"

import { EnergyFactor } from "../data/interface"


export function EnergyBoxes(props: { factors: EnergyFactor[] })
{
    // Display each factor as a box of the appropriate height.
    const sinks = props.factors.filter(f => f.type === "sink").reverse()
    const sources = props.factors.filter(f => f.type !== "sink").reverse()

    return <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexDirection: "row" }}>
        <div style={{ display: "flex", justifyContent: "end", flexDirection: "column" }}>
            {sinks.map((factor, i) => <FactorToBox
                key={i}
                factor={factor}
            />)}
        </div>

        <div style={{ display: "flex", justifyContent: "end", flexDirection: "column" }}>
            {sources.map((factor, i) => <FactorToBox
                key={i}
                factor={factor}
            />)}
        </div>
    </div>
}



export function EnergyBoxStack(props: { name: string, factors: EnergyFactor[], is_comparison: boolean })
{
    return <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "column", padding: "0 10px" }}>
        <div style={{ textAlign: "center", marginBottom: 14, fontWeight: "bold" }}>{props.name}</div>
        <div style={{ display: "flex", justifyContent: "end", flexDirection: "column" }}>
            {props.factors.map((factor, i) => <FactorToBox
                key={i}
                factor={factor}
                is_comparison={props.is_comparison}
            />)}
            <div style={{ textAlign: "center", marginTop: 8, fontWeight: "bold" }}>{props.name}</div>
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

function FactorToBox(props: { factor: EnergyFactor, is_comparison?: boolean })
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
