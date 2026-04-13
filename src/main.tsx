import { createRoot } from "react-dom/client"

import "./index.css"
import { SimpleSim } from "./simple_sim/SimpleSim"



function App ()
{
    return <>
        <SimpleSim />
    </>
}

const root = createRoot(document.getElementById("app")!)
root.render(<App />)
