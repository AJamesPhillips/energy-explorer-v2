import { useEffect } from "preact/hooks"
import { LimitedViewType } from "../interface"
import pub_sub from "../state/pub_sub"
import "./GUI.css"
import { Messages } from "./Messages"


export function GUI(props: { view: LimitedViewType })
{
    useEffect(() =>
    {
        if (props.view === "simulation") return

        pub_sub.pub("show_message", {
            message: "Welcome to Energy Explorer",
            show_for_seconds: 3
        })
    }, [props.view])

    return <div id="gui-container">
        <Messages />
    </div>
}
