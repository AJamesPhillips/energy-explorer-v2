import { Canvas } from "@react-three/fiber"

import { DigitalTwin } from "./digital_twin/DigitalTwin"
import "./EnergyExplorerSimV2.css"
import { GUI } from "./gui/GUI"
import { LimitedViewType } from "./interface"
import { SimpleSim } from "./simple_sim/SimpleSim"



export const EnergyExplorerSimV2 = (props: { view: LimitedViewType }) =>
{
    return <>
        <Canvas id="scene-3d">
            {props.view === "simulation" && <SimpleSim />}
            {props.view === "digital_twin" && <DigitalTwin />}
        </Canvas>
        <GUI view={props.view} />
    </>
}
