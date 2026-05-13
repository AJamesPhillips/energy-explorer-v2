import { ReactNode, useState } from "react"

import { BulldozerIcon, CloseIcon } from "../../../components/svgs"


export function FooterBuildOptions(props: {
    options: string[]
    build_aria_label: (option: string) => string
    toggle_aria_label: string
    toggle_collapsed_content: ReactNode
    remove_aria_label: string
})
{
    const [show_options, set_show_options] = useState(false)
    const [selected_option, set_selected_option] = useState("")

    return <div className="footer_row">
        <div className="footer_generation_stack">
            {show_options && <div className="footer_generation_options">
                {props.options.map(option => <button
                    key={option}
                    type="button"
                    className={"ui_button " + (selected_option === option ? "footer_generation_option_selected" : "")}
                    onClick={() => set_selected_option(option)}
                    aria-label={props.build_aria_label(option)}
                >
                    {option}
                </button>)}
                <button
                    type="button"
                    className={"ui_button footer_generation_bulldozer_button " + (selected_option === "Bulldozer" ? "footer_generation_option_selected" : "")}
                    onClick={() => set_selected_option("Bulldozer")}
                    aria-label={props.remove_aria_label}
                >
                    <BulldozerIcon style={{ height: 30 }} />
                </button>
            </div>}

            <button
                type="button"
                className="ui_button footer_generation_toggle_button"
                onClick={() => set_show_options(prev => !prev)}
                aria-expanded={show_options}
                aria-label={props.toggle_aria_label}
            >
                {show_options
                    ? <CloseIcon style={{ height: 16 }} />
                    : props.toggle_collapsed_content}
            </button>
        </div>
    </div>
}
