import { PerspectiveKnowledgeGraph } from "../data/interface"
import { DigitalTwin } from "./digital_twin/DigitalTwin"
import { LimitedViewType } from "./interface"
import "./Sim3d.css"
import { SimpleSim } from "./simple_sim/SimpleSim"



export const Sim3d = (props: { view: LimitedViewType, persective: PerspectiveKnowledgeGraph, population: number }) =>
{
    return <>
        {props.view === "digital_twin" && <DigitalTwin />}
        {props.view === "simulation" && <SimpleSim
            persective={props.persective}
            population={props.population}
        />}
        {/* <GUI view={props.view} /> */}
    </>
}
