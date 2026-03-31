import { useCallback, useEffect, useState } from "preact/hooks"

import "./Disclaimer.css"


export function Disclaimer()
{
    const [disclaimer_shown, set_disclaimer_shown] = useState(boolean_cookie("disclaimer_shown"))
    const [show_nothing, set_show_nothing] = useState(false)

    const on_click = useCallback(() =>
    {
        set_disclaimer_shown(true)
    }, [])

    const on_click_dont_show_again = useCallback(() =>
    {
        set_disclaimer_shown(true)
        document.cookie = "disclaimer_shown=true; max-age=31536000"   // 1 year
    }, [])

    useEffect(() =>
    {
        if (disclaimer_shown)
        {
            const timeout = setTimeout(() =>
            {
                set_show_nothing(true)
            }, 500) // match with the CSS transition duration

            return () => clearTimeout(timeout)
        }
    }, [disclaimer_shown])


    if (show_nothing) return null


    return <div className={"disclaimer " + (disclaimer_shown ? "hidden" : "")}>
        {!disclaimer_shown && <div className="disclaimer-background" onPointerDown={on_click}/>}

        <div className="disclaimer-text-holder">
            <div
                className="disclaimer-text"
                onPointerDown={on_click}
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


function boolean_cookie(name: string)
{
    const cookies = document.cookie.split(";").map(cookie => cookie.trim())
    const match = cookies.find(cookie => cookie.startsWith(name + "="))
    if (!match) return undefined

    const value = match.substring(name.length + 1).toLowerCase()
    if (value === "true") return true
    if (value === "false") return false
    return undefined
}
