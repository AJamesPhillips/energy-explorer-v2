import { useState } from "react"

import { BulldozerIcon, CloseIcon } from "../../../components/svgs"
import "./ElectricityGenerationOptions.css"

const electricity_generation_options = [
    "Gas",
    "Nuclear",
    "Hydro",
    "Biomass",
    "Wave",
    "Tidal",
    "Solar",
    "Wind",
]

export function ElectricityGenerationOptions()
{
    const [show_electricity_generation_options, set_show_electricity_generation_options] = useState(false)
    const [selected_electricity_generation_option, set_selected_electricity_generation_option] = useState("")

    return <div className="footer_row">
        <div className="footer_generation_stack">
            {show_electricity_generation_options && <div className="footer_generation_options">
                {electricity_generation_options.map(option => <button
                    key={option}
                    type="button"
                    className={"ui_button " + (selected_electricity_generation_option === option ? "footer_generation_option_selected" : "")}
                    onClick={() => set_selected_electricity_generation_option(option)}
                    aria-label={`Build ${option} power plant`}
                >
                    {option}
                </button>)}
                <button
                    type="button"
                    className={"ui_button footer_generation_bulldozer_button " + (selected_electricity_generation_option === "Bulldozer" ? "footer_generation_option_selected" : "")}
                    onClick={() => set_selected_electricity_generation_option("Bulldozer")}
                    aria-label="Remove power plant"
                >
                    <BulldozerIcon style={{ height: 30 }} />
                </button>
            </div>}

            <button
                type="button"
                className="ui_button footer_generation_toggle_button"
                onClick={() => set_show_electricity_generation_options(prev => !prev)}
                aria-expanded={show_electricity_generation_options}
                aria-label="Toggle power generation options"
            >
                {show_electricity_generation_options
                    ? <CloseIcon style={{ height: 16 }} />
                    // : <ElectricityBoltIcon style={{ height: 24 }} />}
                    : "⚡"}
            </button>
        </div>
    </div>
}
