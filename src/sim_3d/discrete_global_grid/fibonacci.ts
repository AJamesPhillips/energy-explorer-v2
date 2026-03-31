import * as THREE from "three"

import { FibonacciGridConfig } from "./interface"


// TODO, requires implementating spherical voronoi to create cells
export function draw_fibonacci_points_grid(earth_mesh: THREE.Mesh, config: FibonacciGridConfig)
{
    const num_points = config.num_points || 1000
    const radius = config.radius

    // Generate Fibonacci spiral points on sphere
    const points = generate_fibonacci_sphere_points(num_points, radius)

    console.log(`\n=== Fibonacci Spiral Point Distribution (${num_points} points) ===`)
    console.log(`  Only shows the point distribution, not equal-area cells yet`)
    console.log(`  Points generated: ${points.length}`)
    console.log(`  Creating simple visualization...`)

    // For now, just visualize the points as small spheres to see the distribution
    const point_geometry = new THREE.SphereGeometry(0.02, 8, 6)
    const point_material = new THREE.MeshBasicMaterial({
        color: config.color || 0x00ff00,
        wireframe: config.wireframe,
    })

    for (const point of points)
    {
        const point_mesh = new THREE.Mesh(point_geometry, point_material)
        point_mesh.position.copy(point)
        earth_mesh.add(point_mesh)
    }
}

function generate_fibonacci_sphere_points(num_points: number, radius: number): THREE.Vector3[]
{
    const points: THREE.Vector3[] = []
    const golden_ratio = (1 + Math.sqrt(5)) / 2

    for (let i = 0; i < num_points; i++)
    {
        // Fibonacci spiral algorithm for even distribution on sphere
        const theta = 2 * Math.PI * i / golden_ratio
        const phi = Math.acos(1 - 2 * i / num_points)

        const x = radius * Math.sin(phi) * Math.cos(theta)
        const y = radius * Math.cos(phi)
        const z = radius * Math.sin(phi) * Math.sin(theta)

        points.push(new THREE.Vector3(x, y, z))
    }

    return points
}
