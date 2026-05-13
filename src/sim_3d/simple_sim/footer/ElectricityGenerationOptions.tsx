import { FooterBuildOptions } from "./FooterBuildOptions"
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
    return <FooterBuildOptions
        options={electricity_generation_options}
        build_aria_label={option => `Build ${option} power plant`}
        toggle_aria_label="Toggle power generation options"
        toggle_collapsed_content="⚡"
        remove_aria_label="Remove power plant"
    />
}
