import { Canvas } from "@react-three/fiber"

import { DigitalTwin } from "./digital_twin/DigitalTwin"
import "./EnergyExplorerSimV2.css"
import { GUI } from "./gui/GUI"
import { LimitedViewType } from "./interface"
import { SimpleSim } from "./simple_sim/SimpleSim"



export const EnergyExplorerSimV2 = (props: { view: LimitedViewType }) =>
{
    return <>
        {props.view === "digital_twin" && <Canvas id="scene-3d">
            <DigitalTwin />
        </Canvas>}
        {props.view === "simulation" && <SimpleSim />}
        <GUI view={props.view} />
    </>
}
