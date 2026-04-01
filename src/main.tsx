import { render } from "preact"
import { useState } from "preact/hooks"

import "./monkey_patch"

import { Evaluator } from "core/evaluator/implementation/browser_sandboxed_javascript.ts"

import { BalanceSheetLoader } from "./balance_sheet/BalanceSheetLoader"
import { perspective_id_2009_mackay, perspective_id_general, PerspectiveType, SelectPerspective } from "./balance_sheet/SelectPerspective"
import { Disclaimer } from "./components/Disclaimer"
import "./index.css"
import { EnergyExplorerSimV2 } from "./sim_3d/EnergyExplorerSimV2"


function App ()
{
    const [view, set_view] = useState<"balance_sheet" | "knowledge_graph" | "simulation" | "digital_twin">("knowledge_graph")
    const [perspective_ids, set_perspective_ids] = useState<PerspectiveType[]>([
        perspective_id_2009_mackay, perspective_id_general
    ])


    return <>
        <Evaluator />

        <div style={{ display: "flex", gap: "20px", flexDirection: "row", width: "100%" }}>
            <div id="app_options_panel">
                <div class="app_option" onClick={() => set_view("balance_sheet")}>
                    <img src="/imgs/balance_sheet.png" />
                    <label>Balance Sheet</label>
                </div>
                <div class="app_option" onClick={() => set_view("knowledge_graph")}>
                    <label>Knowledge Graph</label>
                </div>
                <div class="app_option" onClick={() => set_view("simulation")}>
                    <label>Simulation</label>
                </div>
                <div class="app_option" onClick={() => set_view("digital_twin")}>
                    <img src="/imgs/digital_twin.jpg" />
                    <label>Digital Twin</label>
                </div>
            </div>

            <div style={{ display: "flex", gap: "20px", flexDirection: "column", flexGrow: 1 }}>
                <div>
                    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1em", padding: 10 }}>
                        <SelectPerspective
                            perspectives={perspective_ids}
                            on_change={set_perspective_ids}
                        />
                    </div>
                </div>

                <div id="app_main_view">
                    {view === "balance_sheet" && <BalanceSheetLoader perspective_ids={perspective_ids} />}
                    {view === "digital_twin" && <EnergyExplorerSimV2 />}
                </div>
            </div>

        </div>


        <Disclaimer />
    </>
}

render(<App />, document.getElementById("app")!)
