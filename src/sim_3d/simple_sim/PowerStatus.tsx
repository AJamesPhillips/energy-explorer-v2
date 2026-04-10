import "./PowerStatus.css"


export function PowerStatus ({ demand, supply }: { demand: number, supply: number })
{
    const diff = supply - demand
    const is_surplus = diff >= 0
    const status_text = is_surplus ? `Surplus of ${diff} MW` : `Deficit of ${-diff} MW`
    const status_color = is_surplus ? "green" : "red"

    return (
        <div
            style={{
                position: "absolute",
                top: 16,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: "var(--z-index-sim)",
                padding: "5px 20px",
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                borderRadius: 5,
                fontSize: 60,
                // pointerEvents: "none",
            }}
            title={status_text}
        >
            <span>{demand}</span>
            <span style={{ fontSize: 20 }}>GW</span>
            <span style={{ color: status_color }}>{is_surplus ? "+" : ""}{diff}</span>
            <div className={"text_shortage" + (is_surplus ? " surplus" : " shortage")}>
                SHORTAGE
            </div>
        </div>
    )
}
