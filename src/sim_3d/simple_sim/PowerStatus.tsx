import { Html } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useState } from "react"
import { lerp } from "three/src/math/MathUtils.js"

import { LimitedViewType } from "../interface"
import { PowerStats } from "../model/interface"
import "./PowerStatus.css"


export function PowerStatus ({ view, power, datetime }: { view: LimitedViewType, power: PowerStats, datetime?: number })
{
    const [current_supply_gw, set_current_supply_gw] = useState(power.supply_gw)
    const [current_demand_gw, set_current_demand_gw] = useState(power.demand_gw)

    useFrame((_, delta) =>
    {
        // Smoothly animate changes in supply and demand
        const supply_diff = power.supply_gw - current_supply_gw
        const demand_diff = power.demand_gw - current_demand_gw

        const new_current_supply_gw = current_supply_gw + smooth_change(supply_diff, delta)
        const new_current_demand_gw = current_demand_gw + smooth_change(demand_diff, delta)

        set_current_supply_gw(new_current_supply_gw)
        set_current_demand_gw(new_current_demand_gw)
    })

    const diff = current_supply_gw - current_demand_gw
    const is_surplus = diff >= 0
    const status_text = is_surplus ? `Surplus of ${diff} GW` : `Deficit of ${-diff} GW`
    const status_color = is_surplus ? "green" : "red"

    return <Html>
        <div
            style={{
                position: "absolute",
                // Hack to cope with drei's <Html> forcing an absolute position on this element
                top: view === "digital_twin" ? -375 : -100,
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
            <span>{Math.round(current_demand_gw)}</span>
            <span style={{ fontSize: 20 }}>GW</span>
            <span style={{ color: status_color }}>{is_surplus ? "+" : ""}{Math.round(diff)}</span>
            <div className={"text_shortage" + (is_surplus ? " surplus" : " shortage")}>
                SHORTAGE
            </div>
            <div>
                <DatetimeDisplay datetime={datetime} />
            </div>
        </div>
    </Html>
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


function smooth_change(t: number, delta: number)
{
    const sign = Math.sign(t)
    const abs = Math.abs(t)
    if (abs < 0.01) return t
    return (lerp(1, 3, abs) * sign) * delta
}
