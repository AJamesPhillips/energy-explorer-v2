import { render } from "preact"
import "./index.css"

import "./monkey_patch"

import { DemoSim } from "./DemoSim.tsx"


function App ()
{
    return <>
        <DemoSim />
    </>
}

render(<App />, document.getElementById("app")!)
