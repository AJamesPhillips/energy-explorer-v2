import { ElectricityGenerationOptions } from "./ElectricityGenerationOptions"


export function ActionOptions()
{
    return <>
        {/* <GovernmentPolicyOptions
            show_options={show_options === "gov_policy"}
            toggle_showing={toggle_showing_gov_policy_options}
        />
        <CarbonFuelsOptions
            show_options={show_options === "carbon_fuels"}
            toggle_showing={toggle_showing_carbon_fuels_options}
        /> */}
        <ElectricityGenerationOptions />
    </>
}
