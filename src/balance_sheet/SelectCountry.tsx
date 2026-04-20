import { useMemo, useState } from "react"

import { InfoBox } from "../components/InfoBox"
import { CountryData, extended_countries_data, get_country_by_code } from "../data/countries"
import { CountryISO2Code } from "../data/countries_data"
import "./SelectCountry.css"


type LocalUserVotesByCountryCode2 = Partial<Record<CountryISO2Code, boolean>>

interface SelectCountryProps
{
    selected_country_ISO2: CountryISO2Code
}
export function SelectCountry(props: SelectCountryProps)
{
    const [show_info_box, set_show_info_box] = useState(false)
    const [filter_text, set_filter_text] = useState("")
    const initial_user_votes_by_country_code2 = useMemo(() => get_local_user_votes_by_country_code2(), [])
    const [user_votes_by_country_code2, set_user_votes_by_country_code2] = useState(initial_user_votes_by_country_code2)

    const country = get_country_by_code(props.selected_country_ISO2)

    const filtered_countries = extended_countries_data
        .filter(c => c.name.toLowerCase().includes(filter_text) || c.code2.toLowerCase().includes(filter_text)  || c.code3.toLowerCase().includes(filter_text))

    const implemented_countries = filtered_countries.filter(c => c.implemented)
    const unimplemented_countries = filtered_countries.filter(c => !c.implemented)

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
                        <h1>Vote for a Country</h1>
                        <p>
                            If you are interested in seeing a particular country added
                            to the simulation <a href="https://docs.google.com/forms/d/e/1FAIpQLSdKpO2KkvlXnhEoo9VejTID8tfGbHA_BEbZuFrsAku_TahH8w/viewform?entry.1843888779=">subscribe </a> or
                            send us a message on <a href="https://github.com/AJamesPhillips/energy-explorer-v2/issues/new?title=[REQUEST]%20I%27d%20like%20to%20be%20able%20to%20play%20country%20...">GitHub</a>,
                            or <a href="https://bsky.app/profile/ajamesphillips.com">BlueSky</a>.
                            {/* press ⚡ to upvote it */}
                            Or <a href="https://www.patreon.com/WikiSim">donate to show your support ❤️</a>
                        </p>

                        <Filter set_filter_text={set_filter_text} />

                        <div id="countries_list">
                            <div className="countries_list_first_sub_heading">
                                IMPLEMENTED ({implemented_countries.length}):
                            </div>

                            {implemented_countries.map(c => <CountryRow
                                key={c.code2}
                                country={c}
                                user_votes_by_country_code2={user_votes_by_country_code2}
                                set_user_votes_by_country_code2={set_user_votes_by_country_code2}
                            />)}

                            <div className="countries_list_second_sub_heading">
                                NOT IMPLEMENTED YET ({unimplemented_countries.length}):
                            </div>

                            {unimplemented_countries.map(c => <CountryRow
                                key={c.code2}
                                country={c}
                                user_votes_by_country_code2={user_votes_by_country_code2}
                                set_user_votes_by_country_code2={set_user_votes_by_country_code2}
                            />)}
                        </div>
                    </>
                }
                on_close={() => set_show_info_box(false)}
            />}
        </div>
    )
}


function Filter(props: { set_filter_text: (text: string) => void })
{
    return <p style={{ display: "flex" }}>
        <input
            type="text"
            placeholder="Filter countries..."
            onChange={(e) => props.set_filter_text(e.target.value.toLowerCase())}
            style={{ flexGrow: 1, padding: "8px", marginBottom: "10px" }}
        />
    </p>
}


interface CountryRowProps
{
    key: string
    country: CountryData
    user_votes_by_country_code2: LocalUserVotesByCountryCode2
    set_user_votes_by_country_code2: (votes: LocalUserVotesByCountryCode2) => void
}
function CountryRow(props: CountryRowProps)
{
    const { country } = props
    const user_vote = props.user_votes_by_country_code2[country.code2] ? 1 : 0

    return <div className="country_row">
        <div>
            {country.emoji} {country.name}
        </div>
        <button
            style={{ padding: "2px 10px", backgroundColor: "initial" }}
            onClick={() =>
            {
                const new_votes = {
                    ...props.user_votes_by_country_code2,
                    [country.code2]: props.user_votes_by_country_code2[country.code2] || false,
                }
                new_votes[country.code2] = !new_votes[country.code2]
                props.set_user_votes_by_country_code2(new_votes)
                set_local_user_votes_by_country_code2(new_votes)
            }}
        >
            {country.votes + user_vote}&nbsp;⚡
        </button>
    </div>
}


function get_local_user_votes_by_country_code2(): LocalUserVotesByCountryCode2
{
    const votes_str = localStorage.getItem("country_votes")
    if (!votes_str) return {}

    try
    {
        return JSON.parse(votes_str)
    }
    catch (e)
    {
        console.error("Error parsing country votes from localStorage", e)
        return {}
    }
}


function set_local_user_votes_by_country_code2(votes: LocalUserVotesByCountryCode2)
{
    localStorage.setItem("country_votes", JSON.stringify(votes))
}
