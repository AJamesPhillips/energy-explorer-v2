import { useMemo } from "react"

import { DataComponentsById } from "core/data/interface"
import { make_graph } from "core/data/utils/graph"

import "./BalanceSheet.css"
import { EnergyBoxStack } from "./EnergyBoxes"
import { factors_up_to } from "./EnergyBoxesHelper"
import {
    perspective_id_general,
    perspective_id_to_name_map,
    PerspectiveType
} from "./SelectPerspective"


interface BalanceSheetProps
{
    perspective_ids: PerspectiveType[]
    // components: DataComponent[]
    components_map: DataComponentsById
}
export function BalanceSheet(props: BalanceSheetProps)
{
    const { perspective_ids, components_map } = props


    const parser = useMemo(() => new DOMParser(), [])

    const persectives = useMemo(() =>
    {
        return perspective_ids.map(perspective_id =>
        {
            const graph = make_graph(parser, components_map, {
                id_of_concepts: perspective_id_general,
                id_of_interest: perspective_id,
                id_of_comparison: perspective_ids[0],
            })
            const factors = factors_up_to("Geothermal", graph)

            const sinks = factors.filter(f => f.type === "sink").reverse()
            const sources = factors.filter(f => f.type !== "sink").reverse()

            return {
                id: perspective_id,
                sinks,
                sources,
            }
        })
    }, [perspective_ids.join(",")])


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
