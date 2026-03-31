import { useMemo, useState } from "react"

import { DataComponent, DataComponentsById } from "core/data/interface"
import { make_graph } from "core/data/utils/graph"

import { EnergyBoxStack } from "./EnergyBoxes"
import { factors_up_to } from "./EnergyBoxesHelper"
import {
    perspective_id_2009_mackay,
    perspective_id_general,
    perspective_id_to_name_map,
    PerspectiveType,
    SelectPerspective,
} from "./SelectPerspective"


export function BalanceSheet(props: { components: DataComponent[], components_map: DataComponentsById })
{
    const { components_map } = props
    const [perspective_ids, set_perspective_ids] = useState<PerspectiveType[]>([
        perspective_id_2009_mackay, perspective_id_general
    ])

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


    return <>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1em" }}>
            <SelectPerspective
                perspectives={perspective_ids}
                on_change={set_perspective_ids}
            />
        </div>

        <div style={{
            display: "flex",
            // justifyContent: "center",
            gap: "20px",
            flexDirection: "row",
            overflowX: "scroll",

            overflow: "scroll",
            height: "60%",
            padding: "100px 100px 0px 100px",
            border: "thin solid black",
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
    </>
}
