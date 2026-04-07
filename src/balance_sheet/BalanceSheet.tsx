import { DataComponentsByIdv } from "core/data/interface"

import Loading from "../components/Loading"
import { Perspective } from "../data/interface"
import "./BalanceSheet.css"
import { EnergyBoxStack } from "./EnergyBoxes"
import {
    perspective_id_to_name_map
} from "./SelectPerspective"


interface BalanceSheetProps
{
    persectives: Perspective[]
    components_map: DataComponentsByIdv | undefined
}
export function BalanceSheet(props: BalanceSheetProps)
{
    const { persectives, components_map } = props


    if (!components_map) return <Loading />


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
                    factors={p.sinks}
                    is_comparison={index > 0}
                />
            ))}

            {persectives.map((p, index) => (
                <EnergyBoxStack
                    key={p.id}
                    name={perspective_id_to_name_map[p.id]}
                    factors={p.sources}
                    is_comparison={index > 0}
                />
            ))}
        </div>

        {/* <GraphViewer components={components} perspective={perspective} /> */}
    </div>
}
