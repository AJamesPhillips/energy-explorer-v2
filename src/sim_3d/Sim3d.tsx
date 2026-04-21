import { DigitalTwin } from "./digital_twin/DigitalTwin"
import { LimitedViewType } from "./interface"
import "./Sim3d.css"
import { SimpleSim } from "./simple_sim/SimpleSim"



export const Sim3d = (props: { view: LimitedViewType }) =>
{
    return <>
        {props.view === "digital_twin" && <DigitalTwin />}
        {props.view === "simulation" && <SimpleSim />}
        {/* <GUI view={props.view} /> */}
    </>
}
