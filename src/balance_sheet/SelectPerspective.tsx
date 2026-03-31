

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

interface SelectPerspectiveProps
{
    perspectives: PerspectiveType[]
    on_change: (perspectives: PerspectiveType[]) => void
    max_perspectives?: number
}

// const order_badges = ["①", "②", "③", "④", "⑤"]

export function SelectPerspective(props: SelectPerspectiveProps)
{
    const { max_perspectives = 2 } = props

    const drop_down_options: { id: PerspectiveType, label: string }[] = option_ids.map(id => ({
        id,
        label: perspective_id_to_name_map[id],
    }))

    function handle_radio(id: PerspectiveType)
    {
        props.on_change([id])
    }

    function handle_checkbox(id: PerspectiveType)
    {
        const selected = props.perspectives
        if (selected.includes(id))
        {
            props.on_change(selected.filter(p => p !== id))
        }
        else if (selected.length < max_perspectives)
        {
            props.on_change([...selected, id])
        }
    }

    const single_selected = props.perspectives.length === 1
    const multi_selected = props.perspectives.length > 1

    return (
        <div>
            <ul style={{ listStyle: "none", padding: 10, margin: 0, border: "1px solid #ccc", borderRadius: 4, display: "flex", flexDirection: "column", gap: "0.5rem", backgroundColor: "#f9f9f9" }}>
                {drop_down_options.map(option =>
                {
                    const selection_index = props.perspectives.indexOf(option.id)
                    const is_selected = selection_index !== -1
                    const checkbox_disabled = (
                        (!is_selected && props.perspectives.length >= max_perspectives)
                        || (is_selected && single_selected)
                    )
                    const checkbox_title = single_selected
                        ? (is_selected
                            ? "At least one perspective must be selected"
                            : `Select ${option.label}`)
                        : checkbox_disabled
                            ? `Maximum ${max_perspectives} perspectives`
                            : `Select ${option.label}`


                    return (
                        <li key={option.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", flex: 1, cursor: "pointer" }}>
                                <input
                                    type="radio"
                                    name="perspective"
                                    checked={single_selected && is_selected}
                                    onChange={() => handle_radio(option.id)}
                                />
                                {option.label}
                            </label>
                            {/* <span style={{
                                width: "1.2em",
                                textAlign: "center",
                                fontSize: "1.1em",
                                color: is_selected ? "#0066cc" : "transparent",
                                userSelect: "none",
                            }}>
                                {is_selected ? order_badges[selection_index] : order_badges[0]}
                            </span> */}
                            <input
                                type="checkbox"
                                checked={is_selected}
                                disabled={checkbox_disabled}
                                onChange={() => handle_checkbox(option.id)}
                                title={checkbox_title}
                            />
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
                    {props.perspectives.map((id, i) =>
                    {
                        const label = drop_down_options.find(o => o.id === id)?.label ?? id
                        return (
                            <span key={id} style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
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
