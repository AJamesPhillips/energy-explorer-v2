import { useCallback, useEffect, useState } from "react"

import "./Disclaimer.css"


const KEY_NAME = "disclaimer_shown"

export function Disclaimer()
{
    const local_storage_disclaimer_shown = boolean_local_storage(KEY_NAME)
    const [disclaimer_shown, set_disclaimer_shown] = useState(local_storage_disclaimer_shown)
    const [show_nothing, set_show_nothing] = useState(local_storage_disclaimer_shown)

    const on_click = useCallback(() =>
    {
        set_disclaimer_shown(true)
    }, [])

    const on_click_dont_show_again = useCallback(() =>
    {
        set_disclaimer_shown(true)
        localStorage.setItem(KEY_NAME, new Date().toISOString())
    }, [])

    useEffect(() =>
    {
        if (disclaimer_shown)
        {
            const timeout = setTimeout(() =>
            {
                set_show_nothing(true)
            }, 300) // match with the CSS transition duration

            return () => clearTimeout(timeout)
        }
    }, [disclaimer_shown])


    if (show_nothing) return null


    return <div className={"disclaimer " + (disclaimer_shown ? "hidden" : "")}>
        <div className="disclaimer-text-holder" onPointerDown={on_click}>
            <div
                className="disclaimer-text"
                onPointerDown={e => e.stopPropagation()}
            >
                <h2>🚧 Energy Explorer v2 🚧</h2>

                <p>
                    This is a work in progress: expect most things to be broken at this stage! 🔥
                </p>
                <p>
                    If you'd like to get involved please reach out via <a href="https://github.com/AJamesPhillips/energy-explorer-v2/issues">this project's GitHub repo</a>.
                </p>
                <p>
                    Otherwise you can check out the original <a href="https://wikisim.org/wiki/1080">Energy Explorer v1</a> instead.
                </p>

                <button onClick={on_click}>
                    Got it!
                </button>

                <input type="checkbox" id="disclaimer-checkbox" onChange={on_click_dont_show_again}/>
                <label htmlFor="disclaimer-checkbox">Don't show this again</label>
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
