import { useEffect } from "react"


export const perspective_id_general = 1239 as const
export const perspective_id_2009_mackay = 1252 as const

export type PerspectiveType = (
    typeof perspective_id_general
    | typeof perspective_id_2009_mackay
)

export const perspective_id_to_name_map: Record<PerspectiveType, string> = {
    [perspective_id_general]: "Wiki",
    [perspective_id_2009_mackay]: "2009, Prof. MacKay",
}

const option_ids: PerspectiveType[] = [
    perspective_id_2009_mackay,
    perspective_id_general,
]
const drop_down_options: Option[] = option_ids.map(id => ({
    id,
    label: perspective_id_to_name_map[id],
}))

interface Option
{
    id: PerspectiveType
    label: string
}

interface SelectPerspectiveProps
{
    force_single: boolean
    selected_perspectives: PerspectiveType[]
    on_change: (perspectives: PerspectiveType[]) => void
}
export function SelectPerspective(props: SelectPerspectiveProps)
{
    const max_perspectives = props.force_single ? 1 : 2
    const { selected_perspectives } = props

    useEffect(() =>
    {
        // Ensure the selected_perspectives do not exceed max_perspectives
        if (selected_perspectives.length <= max_perspectives) return
        const trimmed_selected_perspectives = selected_perspectives.slice(0, max_perspectives)
        props.on_change(trimmed_selected_perspectives)
    }, [selected_perspectives, max_perspectives])


    function handle_radio(id: PerspectiveType)
    {
        props.on_change([id])
    }

    function handle_checkbox(id: PerspectiveType)
    {
        if (selected_perspectives.includes(id))
        {
            props.on_change(selected_perspectives.filter(p => p !== id))
        }
        else
        {
            const new_selected_perspectives = [id, ...selected_perspectives].slice(0, max_perspectives)
            props.on_change(new_selected_perspectives)
        }
    }

    const single_selected = selected_perspectives.length === 1
    const multi_selected = selected_perspectives.length > 1

    return (
        <div id="select_perspective">
            <ul style={{ listStyle: "none", padding: 10, margin: 0, border: "1px solid #ccc", borderRadius: 4, display: "flex", flexDirection: "column", gap: "0.5rem", backgroundColor: "#f9f9f9" }}>
                {drop_down_options.map(option =>
                {
                    const selection_index = selected_perspectives.indexOf(option.id)
                    const is_selected = selection_index !== -1
                    const checkbox_title = `Select ${option.label} to compare`

                    return (
                        <li
                            key={option.id}
                            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                        >
                            <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", flex: 1, cursor: "pointer" }}>
                                <input
                                    type="radio"
                                    name="perspective"
                                    checked={single_selected && is_selected}
                                    onChange={() => handle_radio(option.id)}
                                />
                                {option.label}
                            </label>

                            {!props.force_single && <input
                                type="checkbox"
                                checked={is_selected}
                                onChange={() => handle_checkbox(option.id)}
                                title={checkbox_title}
                            />}
                        </li>
                    )
                })}
            </ul>
            {multi_selected && (
                <div style={{
                    marginTop: "0.5rem",
                    padding: "0.3rem 0.6rem",
                    backgroundColor: "#eef4ff",
                    border: "1px solid #b3d0f5",
                    borderRadius: 4,
                    fontSize: "0.9em",
                    color: "#003d80",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    flexWrap: "wrap",
                }}>
                    <span style={{ fontWeight: 600 }}>Comparing:</span>
                    {selected_perspectives.map((id, i) =>
                    {
                        const label = drop_down_options.find(o => o.id === id)?.label ?? id
                        return (
                            <span
                                key={id}
                                style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}
                            >
                                {i > 0 && <span style={{ color: "#0066cc", fontWeight: 700 }}>→</span>}
                                <span>
                                    {/* {order_badges[i]}{" "} */}
                                {label}</span>
                            </span>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
