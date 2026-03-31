import * as THREE from "three"

import { CommonDependencies } from "../scene/interface"
import { draw_standard_icosahedron_grid } from "./basic_icosahedral"
import { draw_fibonacci_points_grid } from "./fibonacci"
import { draw_h3_grid } from "./h3"
import { GridConfig } from "./interface"


export function draw_earth_grid(deps: CommonDependencies, earth_mesh: THREE.Mesh)
{
    const radius = 2.05
    // Example configurations - comparing different approaches
    const configs: GridConfig[] = [
        // {
        //     type: "standard-icosahedron",
        //     radius,
        //     subdivisions: 0,
        //     wireframe: true,
        //     color: 0x5555ff,
        //     align_with_dymaxion: true,
        // },
        // {
        //     type: "standard-icosahedron",
        //     radius,
        //     subdivisions: 5,
        //     wireframe: true,
        //     color: 0xff00ff,
        //     align_with_dymaxion: true,
        // },
        // {
        //     type: "fibonacci",
        //     radius,
        //     num_points: 500,
        //     wireframe: true,
        //     color: 0x00ff00
        // },
        // {
        //     type: "h3",
        //     radius,
        //     h3_resolution: 0,
        //     wireframe: true,
        //     color: 0xffff00
        // }
    ]

    configs.forEach(config => {
        if (config.type === "standard-icosahedron") {
            draw_standard_icosahedron_grid(earth_mesh, deps, config)
        } else if (config.type === "h3") {
            draw_h3_grid(earth_mesh, config)
        } else if (config.type === "fibonacci") {
            draw_fibonacci_points_grid(earth_mesh, config)
        }
    })
}
