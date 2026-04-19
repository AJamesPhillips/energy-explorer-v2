import { PowerStats } from "../model/interface"
import "./PowerStatus.css"


export function PowerStatus ({ power: { demand_gw, supply_gw }, datetime }: { power: PowerStats, datetime?: number })
{
    const diff = supply_gw - demand_gw
    const is_surplus = diff >= 0
    const status_text = is_surplus ? `Surplus of ${diff} GW` : `Deficit of ${-diff} GW`
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
            <span>{Math.round(demand_gw)}</span>
            <span style={{ fontSize: 20 }}>GW</span>
            <span style={{ color: status_color }}>{is_surplus ? "+" : ""}{Math.round(diff)}</span>
            <div className={"text_shortage" + (is_surplus ? " surplus" : " shortage")}>
                SHORTAGE
            </div>
            <div>
                <DatetimeDisplay datetime={datetime} />
            </div>
        </div>
    )
}



function DatetimeDisplay({ datetime }: { datetime?: number })
{
    if (!datetime) return null

    const date = new Date(datetime)
    const hours = date.getUTCHours().toString().padStart(2, "0")
    const minutes = (Math.floor(date.getUTCMinutes() / 30) * 30).toString().padStart(2, "0")
    // const day = date.getUTCDate().toString().padStart(2, "0")
    // const month = (date.getUTCMonth() + 1).toString().padStart(2, "0")
    // const year = date.getUTCFullYear()

    return (
        <div style={{ fontSize: 16 }}>
            Time: {`${hours}:${minutes}`}
        </div>
    )
}
