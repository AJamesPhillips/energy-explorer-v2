import { render } from "preact"
import { useEffect, useMemo, useState } from "preact/hooks"

import "./monkey_patch"

import { DataComponent } from "core/data/interface"
import { data_components_by_id } from "core/data/utils/data_components_by_id"
import { Evaluator } from "core/evaluator/implementation/browser_sandboxed_javascript"

import { BalanceSheet } from "./balance_sheet/BalanceSheet"
import { perspective_id_2009_mackay, perspective_id_general, PerspectiveType, SelectPerspective } from "./balance_sheet/SelectPerspective"
import { Disclaimer } from "./components/Disclaimer"
import { Options, OptionsType } from "./components/Options"
import { get_wikisim_components } from "./data/get_wikisim_components"
import { top_ids_to_fetch } from "./data/ids"
import "./index.css"
import { EnergyExplorerSimV2 } from "./sim_3d/EnergyExplorerSimV2"


function App ()
{
    const [view, set_view] = useState<OptionsType>("knowledge_graph")
    const [perspective_ids, set_perspective_ids] = useState<PerspectiveType[]>([
        perspective_id_2009_mackay, perspective_id_general
    ])


    const [components, set_components] = useState<DataComponent[] | undefined>(undefined)

    useEffect(() =>
    {
        get_wikisim_components(top_ids_to_fetch, set_components)
    }, [])
    const components_map = useMemo(() => data_components_by_id(components), [components])


    return <>
        <Evaluator />

        <div style={{ display: "flex", gap: "20px", flexDirection: "row", width: "100%" }}>

            <Options selected={view} on_select={set_view} />

            <div style={{ display: "flex", gap: "20px", flexDirection: "column", flexGrow: 1 }}>
                <div id="app_top_bar">
                    <SelectPerspective
                        perspectives={perspective_ids}
                        on_change={set_perspective_ids}
                    />
                </div>

                <div id="app_main_view">
                    {view === "balance_sheet" && <BalanceSheet perspective_ids={perspective_ids} components_map={components_map} />}
                    {view === "digital_twin" && <EnergyExplorerSimV2 />}
                </div>
            </div>

        </div>


        <Disclaimer />
    </>
}

render(<App />, document.getElementById("app")!)
