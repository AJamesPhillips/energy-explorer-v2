import { setup_error_logging } from "./error_logging"
setup_error_logging()

import { useEffect, useMemo, useState } from "react"
import { createRoot } from "react-dom/client"
import * as z from "zod"

import "./monkey_patch"

import { flatten_new_or_data_component_to_json, hydrate_data_component_from_json } from "core/data/convert_between_json"
import { IdAndMaybeVersion } from "core/data/id"
import { data_components_by_ido, data_components_by_idv } from "core/data/utils/data_components_by_id"
import { make_graph } from "core/data/utils/graph"
import { make_field_validators } from "core/data/validate_fields"
import { Evaluator } from "core/evaluator/implementation/browser_sandboxed_javascript"
import { DataComponentAsJSON } from "core/supabase"

import { BalanceSheet } from "./balance_sheet/BalanceSheet"
import { factors_up_to } from "./balance_sheet/EnergyBoxesHelper"
import { SelectCountry } from "./balance_sheet/SelectCountry"
import {
    perspective_id_2009_mackay,
    perspective_id_general,
    PerspectiveType,
    SelectPerspective
} from "./balance_sheet/SelectPerspective"
import { Options, ViewType } from "./components/Options"
import { get_wikisim_components } from "./data/get_wikisim_components"
import { other_ids_performance_boost, top_ids_to_fetch } from "./data/ids"
import { DataComponentExtended, Perspective } from "./data/interface"
import { GraphViewer } from "./graph/GraphViewer"
import "./index.css"
import { EnergyExplorerSimV2 } from "./sim_3d/EnergyExplorerSimV2"
import { Info } from "./sim_3d/simple_sim/Info"


const all_ids_to_fetch: { id: IdAndMaybeVersion, compute_value: boolean }[] = [
    ...top_ids_to_fetch.map(id => ({ id, compute_value: true })),
    ...other_ids_performance_boost.map(id => ({ id, compute_value: false })),
]


function App ()
{
    // const [view, set_view] = useState<ViewType>("balance_sheet")
    // const [view, set_view] = useState<ViewType>("digital_twin")
    const [view, set_view] = useState<ViewType>("simulation")
    const [perspective_ids, set_perspective_ids] = useState<PerspectiveType[]>([
        perspective_id_2009_mackay,
        perspective_id_general
    ])


    function log_error(error: string)
    {
        console.error(error)
    }


    const [components, set_components] = useState(cached_components({ bust_cache: false }))

    useEffect(() =>
    {
        if (components)
        {
            console.log(`Using cache of ${components.length} components`)
            return
        }

        get_wikisim_components(all_ids_to_fetch, (components) =>
        {
            set_components(components)
            cache_components(components)
        })
    }, [])
    const components_map_by_idv = useMemo(() => data_components_by_idv(components), [components])
    const components_map_by_ido = useMemo(() => data_components_by_ido(components), [components])


    // Make the knowledge graph
    const parser = useMemo(() => new DOMParser(), [])

    const persectives: Perspective[] = useMemo(() =>
    {
        if (Object.keys(components_map_by_idv).length === 0) return []

        const idv_of_concepts = components_map_by_ido[perspective_id_general]?.id
        if (!idv_of_concepts)
        {
            log_error(`Concept id ${perspective_id_general} not found in components_map_by_ido`)
            return []
        }

        const perspective_id1 = perspective_ids[1]!
        const idv_of_comparison = components_map_by_ido[perspective_id1]?.id

        return perspective_ids.map(perspective_id =>
        {
            const idv_of_interest = components_map_by_ido[perspective_id]?.id
            if (!idv_of_interest)
            {
                log_error(`Perspective id ${idv_of_interest} not found in components_map_by_ido`)
                return null
            }

            const graph = make_graph(parser, components_map_by_idv, {
                idv_of_concepts,
                idv_of_interest,
                idv_of_comparison,
            })

            const factors = factors_up_to("Defence", graph)

            const sinks = factors.filter(f => f.type === "sink").reverse()
            const sources = factors.filter(f => f.type !== "sink").reverse()

            return {
                id: perspective_id,
                graph,
                sinks,
                sources,
            }
        })
        .filter(p => !!p)
    }, [components_map_by_idv, perspective_ids.join(",")])


    return <>
        <Evaluator />

        {(view === "simulation" || view === "digital_twin") && <EnergyExplorerSimV2 view={view} />}

        <div id="app_html">

            <Options selected={view} on_select={set_view} />

            <div style={{ display: "flex", gap: "20px", flexDirection: "column", flexGrow: 1 }}>
                <div id="app_top_bar">
                    <div id="app_top_bar_side">
                        <div className="app_controls_row">
                            <Info />
                            <SelectCountry selected_country_ISO2="GB" />
                        </div>
                        <SelectPerspective
                            perspectives={perspective_ids}
                            on_change={set_perspective_ids}
                        />
                    </div>
                </div>

                <div id="app_main_view">
                    {view === "balance_sheet" && <BalanceSheet
                        persectives={persectives}
                        components_map_by_idv={components_map_by_idv}
                        components_map_by_ido={components_map_by_ido}
                    />}
                    {view === "knowledge_graph" && <GraphViewer persectives={persectives} />}
                </div>
            </div>

        </div>
    </>
}

const root = createRoot(document.getElementById("app")!)
root.render(<App />)

interface DataComponentAsJSONForGraph extends DataComponentAsJSON
{
    computed_value: string | undefined
    multiple_versions: { latest_version: number } | undefined
}

function cached_components(args: { bust_cache?: boolean } = {}): DataComponentExtended[] | undefined
{
    const cached = localStorage.getItem("components")
    if (!cached || args.bust_cache) return undefined

    try
    {
        const parsed = JSON.parse(cached) as DataComponentAsJSONForGraph[]
        const validators = make_field_validators(z)
        if (Array.isArray(parsed)) return parsed.map(j =>
        {
            const { computed_value, multiple_versions, ...rest } = j
            const hydrated: DataComponentExtended = {
                ...hydrate_data_component_from_json(rest, validators),
                computed_value,
                multiple_versions,
            }
            return hydrated
        })
        return undefined
    }
    catch (e)
    {
        console.error("Error parsing cached components", e)
        return undefined
    }
}


function cache_components(components: DataComponentExtended[])
{
    try
    {
        const json = components.map(c =>
        {
            const { computed_value, multiple_versions, ...rest } = c
            const json: DataComponentAsJSONForGraph = {
                ...flatten_new_or_data_component_to_json(rest),
                computed_value,
                multiple_versions,
            }
            return json
        })
        localStorage.setItem("components", JSON.stringify(json))
    }
    catch (e)
    {
        console.error("Error caching components", e)
    }
}
