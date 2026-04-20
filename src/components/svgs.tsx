import { asset_url } from "../utils/asset_url"
const bluesky_logo_url = asset_url("svgs/bluesky.svg")
const github_logo_url = asset_url("svgs/github.svg")
const mail_logo_url = asset_url("svgs/mail.svg")


export function BlueSkyLogo(props: { height?: number })
{
    return <img src={bluesky_logo_url} style={{ height: props.height }} />
}

export function GitHubLogo(props: { height?: number })
{
    return <img src={github_logo_url} style={{ height: props.height }} />
}

export function MailLogo(props: { height?: number })
{
    return <img src={mail_logo_url} style={{ height: props.height }} />
}
