import { CarbonFuelsIcon } from "../../../components/svgs"
import "./ElectricityGenerationOptions.css"
import { FooterBuildOptions } from "./FooterBuildOptions"

const carbon_fuels_options = [
    "Oil&Gas Rig",
    "Pipeline",
    "Refineries",
    "Storage",
    "Terminals",
]

export function CarbonFuelsOptions()
{
    return <FooterBuildOptions
        options={carbon_fuels_options}
        build_aria_label={option => `Build ${option}`}
        toggle_aria_label="Toggle carbon fuels options"
        toggle_collapsed_content={<CarbonFuelsIcon style={{ height: 24 }} />}
        remove_aria_label="Remove carbon fuels infrastructure"
    />
}
