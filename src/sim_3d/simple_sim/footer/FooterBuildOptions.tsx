import { ReactNode, useState } from "react"

import { BulldozerIcon, CloseIcon } from "../../../components/svgs"
import "./FooterBuildOptions.css"


interface Option
{
    text: string
    enabled: boolean
}

export function FooterBuildOptions(props: {
    show_options: boolean
    toggle_showing: () => void
    options: Option[]
    build_aria_label: (option: string) => string
    toggle_aria_label: string
    toggle_collapsed_content: ReactNode
    remove_aria_label: string
})
{
    const [selected_option, set_selected_option] = useState("")

    return <div className="footer_row">
        <div className="actions_stack">
            {props.show_options && <div className="actions_options">
                {props.options.map(option => <button
                    key={option.text}
                    type="button"
                    className={
                        "ui_button "
                        + (selected_option === option.text ? "actions_option_selected" : "")
                        + (option.enabled ? "" : "actions_option_disabled")
                    }
                    onClick={() => set_selected_option(selected => selected === option.text ? "" : option.text)}
                    aria-label={props.build_aria_label(option.text)}
                    disabled={!option.enabled}
                >
                    {option.text}
                </button>)}
                {false && <button
                    type="button"
                    className={"ui_button actions_bulldozer_button " + (selected_option === "Bulldozer" ? "actions_option_selected" : "")}
                    onClick={() => set_selected_option(selected => selected === "Bulldozer" ? "" : "Bulldozer")}
                    aria-label={props.remove_aria_label}
                >
                    <BulldozerIcon style={{ height: 30 }} />
                </button>}
            </div>}

            <button
                type="button"
                className="ui_button actions_toggle_button"
                onClick={props.toggle_showing}
                aria-expanded={props.show_options}
                aria-label={props.toggle_aria_label}
            >
                {props.show_options
                    ? <CloseIcon style={{ height: 16 }} />
                    : props.toggle_collapsed_content}
            </button>
        </div>
    </div>
}
