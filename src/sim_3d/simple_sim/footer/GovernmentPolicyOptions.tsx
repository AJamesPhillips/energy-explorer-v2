import { ReactNode, useState } from "react"

import { InfoBox } from "../../../components/InfoBox"
import { GovernmentPolicyIcon } from "../../../components/svgs"
import { WarningAppUnderConstruction } from "../../../components/WarningAppUnderConstruction"
import "./GovernmentPolicyOptions.css"


export function GovernmentPolicyOptions(props: { show_options: boolean, toggle_showing: () => void })
{
    const [oil_gas_tax_active, set_oil_gas_tax_active] = useState(false)
    const [oil_gas_tax_level, set_oil_gas_tax_level] = useState(10)

    const [green_electricity_tax_active, set_green_electricity_tax_active] = useState(false)
    const [green_electricity_tax_level, set_green_electricity_tax_level] = useState(5)

    const [regional_pricing_active, set_regional_pricing_active] = useState(false)

    return <>
        <div className="footer_row">
            <button
                type="button"
                className="ui_button footer_generation_toggle_button"
                aria-label="Toggle government policy options"
                onClick={props.toggle_showing}
            >
                Policy <GovernmentPolicyIcon style={{ height: 24 }} />
            </button>
        </div>

        {props.show_options && <InfoBox
            wider_info_box={true}
            on_close={props.toggle_showing}
            confirmation_button={({ close_info_box }) => <button onClick={close_info_box}>Close</button>}
            message={<div style={{ maxHeight: "50vh", overflowY: "scroll" }}>
                <h1>Government Policy</h1>

                <WarningAppUnderConstruction />

                <p>
                    Adjust policy levers to explore how national choices can influence
                    energy costs, investment and fairness.
                </p>

                <PolicySection
                    id="oil_gas_extraction_tax"
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
                    id="retail_green_tax"
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
                    id="regional_pricing"
                    title="Toggle regional or national electricity pricing"
                    description="Currently: national pricing is assumed in this model."
                    options_description="Option: switch between national and regional pricing to compare impacts."
                    active={regional_pricing_active}
                    on_toggle={() => set_regional_pricing_active(active => !active)}
                />
            </div>}
        />}
    </>
}


function PolicySection(props: {
    id: string
    title: string
    description: string
    options_description: string
    active: boolean
    on_toggle: () => void
    children?: ReactNode
})
{
    return <div className="government_policy_section">
        <h2 className="government_policy_section_title">{props.title}</h2>
        <p className="government_policy_section_text">{props.description}</p>
        <p className="government_policy_section_text">{props.options_description}</p>
        <button
            type="button"
            onClick={props.on_toggle}
            aria-expanded={props.active}
            aria-controls={"government_policy_controls_" + props.id}
        >
            {props.active ? "Deactivate policy" : "Activate policy"}
        </button>
        <p aria-live="polite" className="government_policy_status_text">
            {props.active ? "Policy activated." : "Policy deactivated."}
        </p>
        {props.active && <div id={"government_policy_controls_" + props.id}>
            {props.children}
        </div>}
    </div>
}
