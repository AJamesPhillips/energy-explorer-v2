import { useEffect, useMemo, useState } from "react"

import { IdAndMaybeVersion } from "core/data/id"
import { DataComponent } from "core/data/interface"
import { data_components_by_id } from "core/data/utils/data_components_by_id"
import { request_dependencies, setup_runtime } from "core/evaluation/setup_runtime"
import { get_supabase } from "core/supabase/browser"

import { BalanceSheet } from "./BalanceSheet"
import { top_ids_to_fetch } from "./data"



export function BalanceSheetLoader(props: {})
{
    const [components, set_components] = useState<DataComponent[]>([])

    useEffect(() =>
    {
        get_wikisim_components(top_ids_to_fetch, set_components)
    }, [])
    const components_map = useMemo(() => data_components_by_id(components), [components])

    if (components.length === 0) return <div>Loading...</div>

    return <BalanceSheet components={components} components_map={components_map} />
}


function get_wikisim_components(ids: IdAndMaybeVersion[], set_components: (components: DataComponent[]) => void): Promise<void>
{
    return request_dependencies({
        get_supabase,
        ids,
    })
    .then(responses =>
    {
        return Promise.all(responses.map(response => setup_runtime({
            components: response,
            __dangerously_skip_sandboxing: false,
            is_node: false,
        })))
        .then(() =>
        {
            const components: DataComponent[] = responses.map(response =>
            {
                const { component, dependencies } = response

                const all_async_components = dependencies
                const some_components = all_async_components.map(c => c.component)
                const all_components = [component, ...some_components].filter(c => !!c)

                return all_components
            }).flat()

            set_components(components)
        })
    })
}
