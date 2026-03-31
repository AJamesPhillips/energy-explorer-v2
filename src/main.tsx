import { render } from "preact"
import { useState } from "preact/hooks"

import "./monkey_patch"

import { Evaluator } from "core/evaluator/implementation/browser_sandboxed_javascript.ts"

import { BalanceSheetLoader } from "./balance_sheet/BalanceSheetLoader"
import { Disclaimer } from "./components/Disclaimer"
import "./index.css"
import { EnergyExplorerSimV2 } from "./sim_3d/EnergyExplorerSimV2"


function App ()
{
    const [view, set_view] = useState<"balance_sheet" | "knowledge_graph" | "simulation" | "digital_twin">("balance_sheet")


    return <>
        <Evaluator />

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

        <div id="app_main_view">
            {view === "balance_sheet" && <BalanceSheetLoader />}
            {view === "digital_twin" && <EnergyExplorerSimV2 />}
        </div>

        <Disclaimer />
    </>
}

render(<App />, document.getElementById("app")!)
