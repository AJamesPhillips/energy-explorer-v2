import { GitHubLogo, MagnifyingGlassLogo, MailLogo } from "../../components/svgs"
import "./FooterLinks.css"


export function FooterLinks()
{
    return <div id="footer_links">
        If you enjoy this please share it.
        If you want to get involved you can <a href="mailto:hello@wikisim.org">email us <MailLogo height={14} /></a>,{" "}
        <a href="https://wikisim.org/wiki/1272">check the data <MagnifyingGlassLogo height={14} /></a>,{" "}
        <a href="https://github.com/AJamesPhillips/energy-explorer-v2/issues">add code <GitHubLogo height={14} /></a>,{" "}
        or <a href="https://www.patreon.com/WikiSim">donate to support us to do more ❤️</a>
    </div>
}
