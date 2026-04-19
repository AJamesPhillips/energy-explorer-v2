import { useState } from "react"
import { InfoBox } from "../components/InfoBox"
import { get_country_by_code } from "../data/countries"
import { CountryISO2Code } from "../data/countries_data"
import "./SelectCountry.css"


interface SelectCountryProps
{
    selected_country_ISO2: CountryISO2Code
}

export function SelectCountry(props: SelectCountryProps)
{
    const [show_info_box, set_show_info_box] = useState(false)

    const country = get_country_by_code(props.selected_country_ISO2)

    return (
        <div id="select_country">
            <span
                style={{ fontSize: "24px" }}
                onClick={() => set_show_info_box(true)}
            >
                {country?.emoji}
            </span>

            {show_info_box && <InfoBox
                id="select_country"
                message={
                    <>
                        <h1>Select Country</h1>
                        <p>
                            If you are interested in seeing a particular country added
                            to the simulation press ⚡ to upvote it.  And donate to show your support ❤️
                        </p>


                    </>
                }
                on_close={() => set_show_info_box(false)}
            />}
        </div>
    )
}
