import { DataComponentsByIdo, DataComponentsByIdv } from "core/data/interface"

import Loading from "../components/Loading"
import { DataComponentExtended, Perspective } from "../data/interface"
import "./BalanceSheet.css"
import { EnergyBoxStack } from "./EnergyBoxes"
import {
    perspective_id_to_name_map
} from "./SelectPerspective"


interface BalanceSheetProps
{
    persectives: Perspective[]
    components_map_by_idv: DataComponentsByIdv<DataComponentExtended> | undefined
    components_map_by_ido: DataComponentsByIdo<DataComponentExtended> | undefined
}
export function BalanceSheet(props: BalanceSheetProps)
{
    const { persectives, components_map_by_idv, components_map_by_ido } = props


    if (!components_map_by_idv || !components_map_by_ido) return <Loading />


    return <div id="balance_sheet">
        <div style={{
            display: "flex",
            // justifyContent: "center",
            gap: "20px",
            flexDirection: "row",
        }}>
            {persectives.map((p, index) => (
                <EnergyBoxStack
                    key={p.id}
                    name={perspective_id_to_name_map[p.id]}
                    total_kwh_per_day_person={get_total_kwh_per_day_person(components_map_by_ido[p.id], "sink")}
                    factors={p.sinks}
                    is_comparison={index > 0}
                />
            ))}

            {persectives.map((p, index) => (
                <EnergyBoxStack
                    key={p.id}
                    name={perspective_id_to_name_map[p.id]}
                    total_kwh_per_day_person={get_total_kwh_per_day_person(components_map_by_ido[p.id], "source")}
                    factors={p.sources}
                    is_comparison={index > 0}
                />
            ))}
        </div>

        {/* <GraphViewer components={components} perspective={perspective} /> */}
    </div>
}


function get_total_kwh_per_day_person(component: DataComponentExtended | undefined, type: "sink" | "source"): number | undefined
{
    if (!component) return undefined

    if (!component.computed_value) return undefined

    const parsed = JSON.parse(component.computed_value)
    if (type === "sink") return parseInt(parsed.total_demand)
    else return parseInt(parsed.total_supply)
}
