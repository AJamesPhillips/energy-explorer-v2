import * as THREE from "three"

import { BufferGeometryUtils } from "three/examples/jsm/Addons.js"
import { CommonDependencies } from "../scene/interface"
import {
    add_gui_rotation_controls,
    add_subscription_to_gui_rotation_change,
    iteratively_find_best_rotation_fit_to_dymaxion,
} from "./basic_icosahedral_optimise_dymaxion"
import { BasicIcosahedralGridConfig } from "./interface"
import { log_dgg_stats } from "./stats"
import { area_of_polygon_in_km2, split_into_pent_and_hexagons } from "./utils"


const shared = {
    rotation: new THREE.Euler(
        // These initial values were found manual by using the GUI controls
        // until the pentagons from this icosahedron aligned with H3's pentagons
        // -0.450598163397448,
        // -0.653398163397448,
        // -0.00309908169872414,
        // These values were found by running the `iteratively_find_best_rotation_fit_to_dymaxion` function
        -0.4486166852955457,
        -0.6534659979004482,
        -0.004049606581624142,
        "XYZ"
    )
}

const optimise_dymaxion_rotational_alignment = false

export function draw_standard_icosahedron_grid(earth_mesh: THREE.Mesh, { scene, gui }: CommonDependencies, config: BasicIcosahedralGridConfig)
{
    config.align_with_dymaxion = config.align_with_dymaxion ?? true
    const orig_geometry = new THREE.IcosahedronGeometry(config.radius, config.subdivisions)

    // Remove normals and UVs before merging to allow vertex deduplication
    orig_geometry.deleteAttribute("normal")
    if (orig_geometry.getAttribute("uv")) orig_geometry.deleteAttribute("uv")
    const geometry = BufferGeometryUtils.mergeVertices(orig_geometry)

    // Calculate and log area statistics
    // const areas = calculate_triangle_areas(geometry)
    const { pentagons, hexagons } = split_into_pent_and_hexagons(geometry)
    const earth_arbitrary_area = 4 * Math.PI * config.radius * config.radius // Use the surface area of the sphere as arbitrary area
    const pentagon_areas = pentagons.map(p => area_of_polygon_in_km2(p, earth_arbitrary_area))
    const hexagon_areas = hexagons.map(h => area_of_polygon_in_km2(h, earth_arbitrary_area))
    log_dgg_stats(`STANDARD Icosahedron (subdivisions: ${config.subdivisions})`, pentagon_areas, hexagon_areas, true)
    console.log(`\n=== STANDARD Icosahedron (subdivisions: ${config.subdivisions}) ===`)

    geometry.computeVertexNormals()

    const material = new (config.wireframe ? THREE.MeshBasicMaterial : THREE.MeshStandardMaterial)({
        color: config.color || 0xff00ff,
        side: THREE.DoubleSide,
        wireframe: config.wireframe,
    })

    const globe_grid_mesh = new THREE.Mesh(geometry, material)
    globe_grid_mesh.position.set(0, 0, 0)

    if (config.align_with_dymaxion)
    {
        globe_grid_mesh.rotation.copy(shared.rotation)

        // Optimise alignment with Dymaxion map
        if (optimise_dymaxion_rotational_alignment)
        {
            add_gui_rotation_controls(shared, gui)

            add_subscription_to_gui_rotation_change(() => {
                globe_grid_mesh.rotation.copy(shared.rotation)
            })

            // At the moment, only setup to run optimisation when subdivisions is 0
            if (config.subdivisions === 0) iteratively_find_best_rotation_fit_to_dymaxion(shared, geometry, globe_grid_mesh, scene, config)
        }
    }

    earth_mesh.add(globe_grid_mesh)
}
