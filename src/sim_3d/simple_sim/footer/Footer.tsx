import { useState } from "react"

import { InfoBox } from "../../../components/InfoBox"
import { Link } from "../../../components/Link"
import { BulldozerIcon, CloseIcon, ElectricityBoltIcon, GitHubLogo, MagnifyingGlassIcon, MailIcon } from "../../../components/svgs"
import { is_narrow_screen } from "../../../utils/screen_type"
import pub_sub from "../../state/pub_sub"
import "./Footer.css"
import { TileInfo } from "./TileInfo"


const power_generation_options = ["Nuclear", "Gas", "Biomass", "Wave", "Tidal"]

export function Footer()
{
    const [show_contact_info, set_show_contact_info] = useState(false)
    const [show_power_generation_options, set_show_power_generation_options] = useState(false)
    const [selected_power_generation_option, set_selected_power_generation_option] = useState("")

    return <div id="app_footer">
        {false && <div className="footer_row">
            <TileInfo />
        </div>}

        <div className="footer_row">
            <div className="footer_generation_stack">
                {show_power_generation_options && <div className="footer_generation_options">
                    {power_generation_options.map(option => <button
                        key={option}
                        type="button"
                        className={"ui_button " + (selected_power_generation_option === option ? "footer_generation_option_selected" : "")}
                        onClick={() => set_selected_power_generation_option(option)}
                        aria-label={`Build ${option} power plant`}
                    >
                        {option}
                    </button>)}
                    <button
                        type="button"
                        className={"ui_button footer_generation_bulldozer_button " + (selected_power_generation_option === "Bulldozer" ? "footer_generation_option_selected" : "")}
                        onClick={() => set_selected_power_generation_option("Bulldozer")}
                        aria-label="Remove power plant"
                    >
                        <BulldozerIcon style={{ height: 20 }} />
                    </button>
                </div>}

                <button
                    type="button"
                    className="ui_button footer_generation_toggle_button"
                    onClick={() => set_show_power_generation_options(prev => !prev)}
                    aria-expanded={show_power_generation_options}
                    aria-label="Toggle power generation options"
                >
                    {show_power_generation_options
                        ? <CloseIcon style={{ height: 16 }} />
                        : <ElectricityBoltIcon style={{ height: 24 }} />}
                </button>
            </div>
        </div>

        <div className="footer_row">
            <div className="ui_button" onClick={() => set_show_contact_info(true)}>
                {is_narrow_screen() ? <>❤️</> : <span>Subscribe <MailIcon style={{ height: 24 }} /> / Donate ❤️</span>}
            </div>
        </div>

        {show_contact_info && <InfoBox
            message={
                <div style={{ whiteSpace: ""}}>
                    If you enjoyed this please share it.
                    You can <Link
                        url="https://docs.google.com/forms/d/e/1FAIpQLSdKpO2KkvlXnhEoo9VejTID8tfGbHA_BEbZuFrsAku_TahH8w/viewform"
                        noWrap={true}
                    >
                        subscribe <MailIcon style={{ height: 14 }} />
                    </Link>{" "}
                    <Link
                        url="mailto:hello@wikisim.org"
                        noWrap={true}
                    >
                        email us <MailIcon style={{ height: 14 }} />
                    </Link>{" "}
                    check the <a href="" style={{ whiteSpace: "nowrap" }} onClick={e =>
                    {
                        e.preventDefault()
                        pub_sub.pub("show_info_and_data_sources", true)
                    }}>data <MagnifyingGlassIcon height={14} /></a>{" "}
                    <Link
                        url="https://github.com/AJamesPhillips/energy-explorer-v2/issues"
                        noWrap={true}
                    >
                        code <GitHubLogo height={14} />
                    </Link>{" "}
                    {/* or <Link
                        url="https://www.patreon.com/WikiSim"
                        noWrap={true}
                    >
                        donate ❤️
                    </Link> */}

                    <p>
                        I hope you enjoyed and learnt something from this simulation.
                        It took a lot of work to make this so please
                        consider <a
                            href="https://www.patreon.com/WikiSim"
                            style={{ whiteSpace: "nowrap" }}
                        >
                            donating ❤️
                        </a>
                    </p>
                </div>
            }
            on_close={() => set_show_contact_info(false)}
        />}
    </div>
}
