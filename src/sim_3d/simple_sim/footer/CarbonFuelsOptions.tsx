import { CarbonFuelsIcon } from "../../../components/svgs"
import { is_narrow_screen } from "../../../utils/screen_type"
import { FooterBuildOptions } from "./FooterBuildOptions"

const carbon_fuels_options = [
    { text: "Oil&Gas Rig", enabled: true },
    // { text: "Pipeline", enabled: false },
    // { text: "Refineries", enabled: false },
    // { text: "Storage", enabled: false },
    // { text: "Terminals", enabled: false },
]

export function CarbonFuelsOptions(props: { show_options: boolean, toggle_showing: () => void })
{
    return <FooterBuildOptions
        show_options={props.show_options}
        toggle_showing={props.toggle_showing}
        options={carbon_fuels_options}
        build_aria_label={option => `Build ${option}`}
        toggle_aria_label="Toggle carbon fuels options"
        toggle_collapsed_content={<span>
            {is_narrow_screen() ? "" : "Oil & Gas "}<CarbonFuelsIcon style={{ height: 24 }} />
        </span>}
        remove_aria_label="Remove carbon fuels infrastructure"
    />
}
