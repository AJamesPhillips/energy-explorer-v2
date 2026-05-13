import { FooterBuildOptions } from "./FooterBuildOptions"


const electricity_generation_options = [
    { text: "Gas", enabled: true },
    // { text: "Biomass", enabled: false },
    { text: "Nuclear", enabled: true },
    // { text: "Hydro", enabled: false },
    // { text: "Wave", enabled: false },
    // { text: "Tidal", enabled: false },
    { text: "Solar", enabled: true },
    { text: "Wind", enabled: true },
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
