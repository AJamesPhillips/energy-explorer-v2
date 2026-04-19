
export type ViewType = "balance_sheet" | "knowledge_graph" | "simulation" | "digital_twin"
interface Option
{
    id: ViewType
    label: string
    img_url: string
    under_construction?: boolean
}
const options: Option[] = [
    {
        id: "balance_sheet",
        label: "Balance Sheet",
        img_url: "/imgs/balance_sheet.png"
    },
    {
        id: "knowledge_graph",
        label: "Knowledge Graph",
        img_url: "/imgs/knowledge_graph3.jpg"
    },
    {
        id: "simulation",
        label: "Simulation",
        img_url: "/imgs/sim.jpg",
        under_construction: true,
    },
    {
        id: "digital_twin",
        label: "Digital Twin",
        img_url: "/imgs/digital_twin.jpg",
        under_construction: true,
    }
]

export function Options ({ selected, on_select }: { selected: string, on_select: (id: ViewType) => void })
{
    return <div id="app_options_panel">
        {options.map(option => <div
            //@ts-ignore - otherwise it shows the error "Property 'key' does not exist on type 'DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>'.ts(2322)"
            key={option.id}
            onClick={() => on_select(option.id)}
            className={"app_option " + (option.id === selected ? "selected" : "")}
        >
            {option.img_url && <img src={option.img_url} alt={option.label} style={{ width: "100%", height: "auto" }} />}
            <span>{option.label}</span>
            {option.under_construction && <span
                style={{
                    color: "red",
                    fontSize: "1em",
                    fontWeight: "bold",
                    position: "absolute",
                    top: "40%",
                }}
            >
                🚧 Under 🚧<br/>
                Construction
            </span>}
        </div>)}
    </div>
}
