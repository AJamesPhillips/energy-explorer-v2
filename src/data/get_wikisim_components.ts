import { request_versioned_data_component_and_dependencies } from "core/data/fetch_from_db"
import { IdAndMaybeVersion } from "core/data/id"
import { data_components_by_idv } from "core/data/utils/data_components_by_id"
import { evaluate_code_in_browser_sandbox } from "core/evaluator/implementation/browser_sandboxed_javascript"
import { load_dependencies_into_runtime } from "core/evaluator/load_dependencies_into_runtime"
import { get_supabase } from "core/supabase/browser"

import { DataComponentExtended } from "./interface"



export async function get_wikisim_components(ids: { id: IdAndMaybeVersion, compute_value: boolean }[], set_components: (components: DataComponentExtended[]) => void): Promise<void>
{
    const response = await request_versioned_data_component_and_dependencies({
        get_supabase,
        ids: ids.map(i => i.id),
        fetch_full_dependency_tree: true,
    })

    if (response.error !== null) return Promise.reject(response.error)

    const components: DataComponentExtended[] = response.data.map(component =>
    {
        return {
            ...component,
            computed_value: undefined,
            multiple_versions: undefined,
        }
    })


    const component_ids_to_compute = new Set(ids.filter(id => id.compute_value).map(id => id.id.to_str()))

    const components_to_compute = components.filter(component =>
    {
        return component_ids_to_compute.has(component.id.to_str())
            || component_ids_to_compute.has(component.id.to_str_without_version())
    })

    // console.log(`Computing values for ${components_to_compute.length} components...`)

    const data_components_by_id_and_version = data_components_by_idv(components)

    for (const component of components_to_compute)
    {
        const response_loading_deps = await load_dependencies_into_runtime({
            component,
            data_components_by_id_and_version,
            evaluate_code_in_runtime: evaluate_code_in_browser_sandbox,
            debugging: false,
            is_node: false,
            timeout_ms: undefined,
        })
        if (response_loading_deps.error) throw new Error(`Error loading dependencies for component with id ${component.id.to_str()}: ${response_loading_deps.error}`)

        const result = await evaluate_code_in_browser_sandbox({
            js_input_value: `;(${component.result_value})()`,
            requested_at: Date.now(),
            debugging: false,
            // timeout_ms: 500000,
        })
        if (result.error !== null) throw new Error(`Error evaluating component with id ${component.id.to_str()}: ${result.error}`)

        component.computed_value = result.result
    }

    set_components(components)
}
