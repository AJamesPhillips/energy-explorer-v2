

// Because we do not save any game state at the moment nor warn the user about
// losing their changes, we force any link clicks to open in a new tab, for now.
export function Link(props: { url: string, children: React.ReactNode })
{
    return <a href={props.url} target="_blank" rel="noopener">
        {props.children}
    </a>
}
