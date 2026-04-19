import { JSX, useCallback, useEffect, useState } from "react"

import "./InfoBox.css"


interface WelcomeInfoProps
{
    id: string
    message: string | JSX.Element
}
export function InfoBox(props: WelcomeInfoProps)
{
    const local_storage_info_box_shown = boolean_local_storage(props.id)
    const [info_box_shown, set_info_box_shown] = useState(local_storage_info_box_shown)
    const [show_nothing, set_show_nothing] = useState(true || local_storage_info_box_shown)

    const on_click = useCallback(() =>
    {
        set_info_box_shown(true)
    }, [])

    const on_click_dont_show_again = useCallback(() =>
    {
        set_info_box_shown(true)
        localStorage.setItem(props.id, new Date().toISOString())
    }, [])

    useEffect(() =>
    {
        if (info_box_shown)
        {
            const timeout = setTimeout(() =>
            {
                set_show_nothing(true)
            }, 300) // match with the CSS transition duration

            return () => clearTimeout(timeout)
        }
    }, [info_box_shown])


    if (show_nothing) return null


    return <div className={"info_box " + (info_box_shown ? "hidden" : "")}>
        <div className="info_box_text_holder" onPointerDown={on_click}>
            <div
                className="info_box_text"
                onPointerDown={e => e.stopPropagation()}
            >
                {props.message}

                <button onClick={on_click}>
                    Got it!
                </button>

                <input type="checkbox" id="info_box_checkbox" onChange={on_click_dont_show_again}/>
                <label htmlFor="info_box_checkbox">Don't show this again</label>
            </div>
        </div>
    </div>
}


function boolean_local_storage(key_name: string, time_to_live_ms = 1000 * 60 * 60 * 24 * 365)
{
    const value = localStorage.getItem(key_name)
    if (!value) return false

    const date = Date.parse(value)
    if (isNaN(date)) return false

    if ((date + time_to_live_ms) < Date.now())
    {
        // localStorage.removeItem(key_name)
        return false
    }

    return true
}
