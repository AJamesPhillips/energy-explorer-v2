import { CSSProperties } from "react"

import { asset_url } from "../utils/asset_url"
const bluesky_logo_url = asset_url("svgs/bluesky.svg")
const close_icon_url = asset_url("svgs/close.svg")
const github_logo_url = asset_url("svgs/github.svg")
const graph_icon_url = asset_url("svgs/graph.svg")
const info_icon_url = asset_url("svgs/info.svg")
const bulldozer_icon_url = asset_url("svgs/bulldozer.svg")
const electricity_bolt_icon_url = asset_url("svgs/electricity_bolt.svg")
const magnifying_icon_url = asset_url("svgs/magnifying_glass.svg")
const mail_icon_url = asset_url("svgs/mail.svg")


const default_style: CSSProperties = {
    display: "inline-block",
    verticalAlign: "center",
}

export function BlueSkyLogo(props: { height?: number })
{
    return <img src={bluesky_logo_url} style={{ ...default_style, height: props.height }} />
}

export function GitHubLogo(props: { height?: number })
{
    return <img src={github_logo_url} style={{ ...default_style, height: props.height }} />
}

const default_icon_style: CSSProperties = {
    ...default_style,
    cursor: "pointer",
}

export function CloseIcon(props: { style?: CSSProperties })
{
    return <img src={close_icon_url} style={{ ...default_icon_style, ...props.style }} />
}

export function GraphIcon(props: { style?: CSSProperties })
{
    return <img src={graph_icon_url} style={{ ...default_icon_style, ...props.style }} />
}

export function InfoIcon(props: { style?: CSSProperties })
{
    return <img src={info_icon_url} style={{ ...default_icon_style, ...props.style }} />
}

export function BulldozerIcon(props: { style?: CSSProperties })
{
    return <img src={bulldozer_icon_url} style={{ ...default_icon_style, ...props.style }} />
}

export function ElectricityBoltIcon(props: { style?: CSSProperties })
{
    return <img src={electricity_bolt_icon_url} style={{ ...default_icon_style, ...props.style }} />
}

export function MagnifyingGlassIcon(props: { height?: number })
{
    return <img src={magnifying_icon_url} style={{ ...default_icon_style, height: props.height }} />
}

export function MailIcon(props: { style?: CSSProperties })
{
    return <img src={mail_icon_url} style={{ ...default_icon_style, ...props.style }} />
}
