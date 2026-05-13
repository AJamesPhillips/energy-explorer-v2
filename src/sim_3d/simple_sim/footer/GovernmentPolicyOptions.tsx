import { ReactNode, useState } from "react"

import { InfoBox } from "../../../components/InfoBox"
import { GovernmentPolicyIcon } from "../../../components/svgs"
import "./ElectricityGenerationOptions.css"


export function GovernmentPolicyOptions()
{
    const [show_policies, set_show_policies] = useState(false)

    const [oil_gas_tax_active, set_oil_gas_tax_active] = useState(false)
    const [oil_gas_tax_level, set_oil_gas_tax_level] = useState(10)

    const [green_electricity_tax_active, set_green_electricity_tax_active] = useState(false)
    const [green_electricity_tax_level, set_green_electricity_tax_level] = useState(5)

    const [regional_pricing_active, set_regional_pricing_active] = useState(false)

    return <div className="footer_row">
        <button
            type="button"
            className="ui_button footer_generation_toggle_button"
            aria-label="Toggle government policy options"
            onClick={() => set_show_policies(true)}
        >
            <GovernmentPolicyIcon style={{ height: 24 }} />
        </button>

        {show_policies && <InfoBox
            on_close={() => set_show_policies(false)}
            confirmation_button={({ close_info_box }) => <button onClick={close_info_box}>Close</button>}
            message={<div>
                <h1>Government Policy</h1>

                <p>
                    Adjust policy levers to explore how national choices can influence
                    energy costs, investment and fairness.
                </p>

                <PolicySection
                    title="Tax on oil and gas extraction"
                    description="Currently: no additional extraction tax is applied in this model."
                    options_description="Option: activate this policy and set a tax level to increase extraction costs."
                    active={oil_gas_tax_active}
                    on_toggle={() => set_oil_gas_tax_active(active => !active)}
                >
                    <label style={{ display: "block", marginTop: 8 }}>
                        Tax level: {oil_gas_tax_level}%
                        <input
                            aria-label="Oil and gas extraction tax level"
                            type="range"
                            min={0}
                            max={100}
                            value={oil_gas_tax_level}
                            onChange={event => set_oil_gas_tax_level(Number(event.target.value))}
                            style={{ width: "100%" }}
                        />
                    </label>
                </PolicySection>

                <PolicySection
                    title="Green tax on retail market electricity"
                    description="Currently: no additional retail electricity green tax is applied in this model."
                    options_description="Option: activate this policy and set a tax level to apply a retail green levy."
                    active={green_electricity_tax_active}
                    on_toggle={() => set_green_electricity_tax_active(active => !active)}
                >
                    <label style={{ display: "block", marginTop: 8 }}>
                        Tax level: {green_electricity_tax_level}%
                        <input
                            aria-label="Retail electricity green tax level"
                            type="range"
                            min={0}
                            max={100}
                            value={green_electricity_tax_level}
                            onChange={event => set_green_electricity_tax_level(Number(event.target.value))}
                            style={{ width: "100%" }}
                        />
                    </label>
                </PolicySection>

                <PolicySection
                    title="Toggle regional or national electricity pricing"
                    description="Currently: national pricing is assumed in this model."
                    options_description="Option: switch between national and regional pricing to compare impacts."
                    active={regional_pricing_active}
                    on_toggle={() => set_regional_pricing_active(active => !active)}
                />
            </div>}
        />}
    </div>
}


function PolicySection(props: {
    title: string
    description: string
    options_description: string
    active: boolean
    on_toggle: () => void
    children?: ReactNode
})
{
    return <div style={{ marginTop: 16 }}>
        <h2 style={{ marginBottom: 8 }}>{props.title}</h2>
        <p style={{ marginBottom: 8 }}>{props.description}</p>
        <p style={{ marginBottom: 8 }}>{props.options_description}</p>
        <button type="button" onClick={props.on_toggle}>
            {props.active ? "Deactivate policy" : "Activate policy"}
        </button>
        {props.children}
    </div>
}
