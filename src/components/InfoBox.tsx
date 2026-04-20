import { JSX, useCallback, useEffect, useState } from "react"

import "./InfoBox.css"

const HIDE_ALL_IN_DEV = false //true


interface InfoBoxProps
{
    message: string | JSX.Element
    on_close: () => void
    confirmation_button?: ((p: { on_click: (() => void) }) => JSX.Element)
}
export function InfoBox(props: InfoBoxProps)
{
    const [hiding, set_hiding] = useState(false)
    const [show_nothing, set_show_nothing] = useState(HIDE_ALL_IN_DEV || false)

    const on_click = useCallback(() =>
    {
        set_hiding(true)
    }, [])

    useEffect(() =>
    {
        if (hiding)
        {
            const timeout = setTimeout(() =>
            {
                set_show_nothing(true)
                props.on_close()
            }, 300) // match with the CSS transition duration

            return () => clearTimeout(timeout)
        }
    }, [hiding])


    if (show_nothing) return null


    const confirmation_button = props.confirmation_button
        ? props.confirmation_button({ on_click })
        : <DefaultConfirmationButton on_click={on_click}/>


    return <div id="info_box" className={(hiding ? "hidden" : "")}>
        <div id="info_box_text_holder" onPointerDown={on_click}>
            <div
                id="info_box_text"
                onPointerDown={e => e.stopPropagation()}
            >
                {props.message}

                {confirmation_button}
            </div>
        </div>
    </div>
}


function DefaultConfirmationButton(props: { on_click: () => void })
{
    return <button onClick={props.on_click}>
        Got it!
    </button>
}


interface OnceOffInfoBoxProps
{
    id: string
    message: string | JSX.Element
    on_close?: () => void
    confirmation_button?: ((p: { on_click: (() => void) }) => JSX.Element)
}
export function OnceOffInfoBox(props: OnceOffInfoBoxProps)
{
    const local_storage_info_box_shown = boolean_local_storage(props.id)

    if (local_storage_info_box_shown) return null


    function confirmation_button_fn(p: { on_click: () => void })
    {
        return <>
            <button onClick={p.on_click}>
                Got it!
            </button>

            <input
                type="checkbox"
                id="info_box_checkbox"
                onChange={() =>
                {
                    p.on_click()
                    localStorage.setItem(props.id, new Date().toISOString())
                }}
            />
            <label htmlFor="info_box_checkbox">Don't show this again</label>
        </>
    }


    return <InfoBox
        message={props.message}
        on_close={() => {}}
        confirmation_button={confirmation_button_fn}
    />
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
