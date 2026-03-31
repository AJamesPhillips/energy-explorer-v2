import earcut from "earcut"
import * as THREE from "three"

import { project_points_to_2d } from "../../utils/geo/project_points_to_2d"
import { subdivide_long_geometry_to_sphere } from "../../utils/geo/subdivide_long_geometry_to_sphere"
import { CONSTANTS } from "../CONSTANTS"


export function create_country_surface(points: THREE.Vector3[], radius: number, country_name: string)
{
    const projected = project_points_to_2d(points)

    // Flatten for earcut
    const flat = projected.flat()

    // Triangulate
    const indices = earcut(flat)

    // Build geometry in 3D
    const vertices: number[] = []
    points.forEach(p => vertices.push(p.x, p.y, p.z))

    const surface_geometry = new THREE.BufferGeometry()
    surface_geometry.setIndex(indices)
    surface_geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3))
    // Subdivide to prevent long edges disappearing beneath sphere surface
    subdivide_long_geometry_to_sphere(surface_geometry, radius, country_name)

    const surface_material = new THREE.MeshBasicMaterial({
        color: CONSTANTS.countries.initial_colour,
        transparent: true,
        opacity: CONSTANTS.countries.initial_opacity,
        side: THREE.FrontSide,
        // wireframe: true,
    })

    const surface = new THREE.Mesh(surface_geometry, surface_material)
    return surface
}
