import { useCallback, useState } from "react"
import { CarbonFuelsOptions } from "./CarbonFuelsOptions"
import { ElectricityGenerationOptions } from "./ElectricityGenerationOptions"
import { GovernmentPolicyOptions } from "./GovernmentPolicyOptions"


export function ActionOptions()
{
    const [show_options, set_show_options] = useState<"carbon_fuels" | "electricity" | "gov_policy" | false>(false)

    const toggle_showing_gov_policy_options = useCallback(() => set_show_options(current => current !== "gov_policy" ? "gov_policy" : false), [])
    const toggle_showing_carbon_fuels_options = useCallback(() => set_show_options(current => current !== "carbon_fuels" ? "carbon_fuels" : false), [])
    const toggle_showing_electricity_options = useCallback(() => set_show_options(current => current !== "electricity" ? "electricity" : false), [])

    return <>
        <GovernmentPolicyOptions
            show_options={show_options === "gov_policy"}
            toggle_showing={toggle_showing_gov_policy_options}
        />
        <CarbonFuelsOptions
            show_options={show_options === "carbon_fuels"}
            toggle_showing={toggle_showing_carbon_fuels_options}
        />
        <ElectricityGenerationOptions
            show_options={show_options === "electricity"}
            toggle_showing={toggle_showing_electricity_options}
        />
    </>
}
