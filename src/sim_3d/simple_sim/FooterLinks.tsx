import { Link } from "../../components/Link"
import { GitHubLogo, MagnifyingGlassLogo, MailLogo } from "../../components/svgs"
import pub_sub from "../state/pub_sub"
import "./FooterLinks.css"


export function FooterLinks()
{
    return <div id="footer_links">
        If you enjoy this please share it.
        If you want to get involved you can <Link url="mailto:hello@wikisim.org">email us <MailLogo height={14} /></Link>,{" "}
        <a href="" onClick={e =>
        {
            e.preventDefault()
            pub_sub.pub("show_info_and_data_sources", true)
        }}>check the data <MagnifyingGlassLogo height={14} /></a>,{" "}
        <Link url="https://github.com/AJamesPhillips/energy-explorer-v2/issues">add code <GitHubLogo height={14} /></Link>,{" "}
        or <Link url="https://www.patreon.com/WikiSim">donate to support us to do more ❤️</Link>
    </div>
}
