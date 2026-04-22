import { CSSProperties } from "react"

import { asset_url } from "../utils/asset_url"
const bluesky_logo_url = asset_url("svgs/bluesky.svg")
const github_logo_url = asset_url("svgs/github.svg")
const mail_logo_url = asset_url("svgs/mail.svg")


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

export function MagnifyingGlassLogo(props: { height?: number })
{
    return <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        style={{ ...default_style, height: props.height }}
    >
        <path d="M10 2a8 8 0 015.292 13.708l4.147 4.146a1 1 0 01-1.414 1.414l-4.146-4.147A8 8 0 1110 2zm0 2a6 6 0 100 12A6 6 0 0010 4z" />
    </svg>
}

export function MailLogo(props: { height?: number })
{
    return <img src={mail_logo_url} style={{ ...default_style, height: props.height }} />
}
