
export type OptionsType = "balance_sheet" | "knowledge_graph" | "simulation" | "digital_twin"
interface Option
{
    id: OptionsType
    label: string
    img_url: string
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
        img_url: ""
    },
    {
        id: "simulation",
        label: "Simulation",
        img_url: ""
    },
    {
        id: "digital_twin",
        label: "Digital Twin",
        img_url: "/imgs/digital_twin.jpg"
    }
]

export function Options ({ selected, on_select }: { selected: string, on_select: (id: OptionsType) => void })
{
    return <div id="app_options_panel">
        {options.map(option => <div
            key={option.id}
            onClick={() => on_select(option.id)}
            className={"app_option " + (option.id === selected ? "selected" : "")}
        >
            {option.img_url && <img src={option.img_url} alt={option.label} style={{ width: "100%", height: "auto" }} />}
            <span>{option.label}</span>
        </div>)}
    </div>
}
