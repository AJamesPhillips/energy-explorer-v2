import GUI from "lil-gui"
import * as THREE from "three"

import { convert_lat_lon_to_sphere } from "../utils/geo/convert_lat_lon_to_sphere"
import { BasicIcosahedralGridConfig } from "./interface"


const subscriptions: (() => void)[] = []
const call_subscribers = () => subscriptions.forEach(sub => sub())

let added_gui = false
export function add_gui_rotation_controls(shared: { rotation: THREE.Euler }, gui: GUI)
{
    if (!added_gui)
    {
        added_gui = true
        gui
            .add(shared.rotation, "x", -Math.PI/4, -Math.PI/8, 0.0001)
            .name("Rotation X")
            .onChange(call_subscribers)
        gui
            .add(shared.rotation, "y", -Math.PI/4, -Math.PI/8, 0.0001)
            .name("Rotation Y")
            .onChange(call_subscribers)
        gui
            .add(shared.rotation, "z", -Math.PI/8, Math.PI/8, 0.0001)
            .name("Rotation Z")
            .onChange(call_subscribers)
    }
}

export function add_subscription_to_gui_rotation_change(subscriber: () => void): () => void
{
    subscriptions.push(subscriber)
    subscriber()

    return () => {
        const index = subscriptions.indexOf(subscriber)
        if (index !== -1) {
            subscriptions.splice(index, 1)
        }
    }
}


const vertex_indices_and_expected_lat_lon: { vertex_index: number, expected_lat_lon: [number, number] }[] = [
    // expected_lat_lon for vertices from H3:
    // H3.getRes0Cells().filter(i => H3.isPentagon(i)).map(i => H3.cellToLatLng(i))
    {
        vertex_index: 0,
        expected_lat_lon: [ -2.300882111626747, 174.75460970322266 ],  // h3 ref 807ffffffffffff
    },
    {
        vertex_index: 1,
        expected_lat_lon: [ 50.10320148224133, -143.47849001502516 ],  // h3 ref 801dfffffffffff
    },
    {
        vertex_index: 2,
        expected_lat_lon: [ 39.10000003397592, 122.30000040778702 ],  // h3 ref 8031fffffffffff
    },
    {
        vertex_index: 4,
        expected_lat_lon: [ 64.70000012793487, 10.53619907546767 ],  // h3 ref 8009fffffffffff
    },
    {
        vertex_index: 7,
        expected_lat_lon: [ 10.447345187511033, 58.157705839572586 ],  // h3 ref 8063fffffffffff
    },
    {
        vertex_index: 10,
        expected_lat_lon: [ -23.71792527122296, 112.86767363356437 ],  // h3 ref 80a7fffffffffff
    },
    {
        vertex_index: 16,
        expected_lat_lon: [ 23.71792527122296, -67.13232636643566 ],  // h3 ref 804dfffffffffff
    },
    {
        vertex_index: 19,
        expected_lat_lon: [ -10.447345187511036, -121.8422941604274 ],  // h3 ref 8091fffffffffff
    },
    {
        vertex_index: 22,
        expected_lat_lon: [ -64.7000001279349, -169.46380092453236 ],  // h3 ref 80ebfffffffffff
    },
    {
        vertex_index: 25,
        expected_lat_lon: [ -50.10320148224133, 36.521509984974834 ],  // h3 ref 80d7fffffffffff
    },
    {
        vertex_index: 28,
        expected_lat_lon: [ 2.300882111626747, -5.245390296777328 ],  // h3 ref 8075fffffffffff
    },
    {
        vertex_index: 32,
        expected_lat_lon: [ -39.10000003397591, -57.69999959221297 ],  // h3 ref 80c3fffffffffff
    },
]

interface VertexMeshAndExpectedPosition
{
    vertex_mesh: THREE.Mesh
    expected_position: THREE.Vector3
}

export function iteratively_find_best_rotation_fit_to_dymaxion(shared: { rotation: THREE.Euler }, geometry: THREE.BufferGeometry, globe_mesh: THREE.Mesh, scene: THREE.Scene, config: BasicIcosahedralGridConfig)
{
    if (config.subdivisions !== 0) console.warn(
        "iteratively_find_best_rotation_fit_to_dymaxion should " +
        "only be called with subdivisions === 0 otherwise the vertex_index " +
        "values will not match where we the pentagons have been drawn")

    // Add a sphere at vertices for reference
    const pos = geometry.getAttribute("position") as THREE.BufferAttribute

    const vertex_meshes_and_expected_positions: VertexMeshAndExpectedPosition[] = []

    vertex_indices_and_expected_lat_lon.forEach(({ vertex_index, expected_lat_lon }) =>
    {
        const x = pos.getX(vertex_index)
        const y = pos.getY(vertex_index)
        const z = pos.getZ(vertex_index)
        const vertex_position = new THREE.Vector3(x, y, z)

        const sphere_geometry = new THREE.SphereGeometry(0.05, 16, 16)
        const sphere_material = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.5 })
        const vertex_mesh = new THREE.Mesh(sphere_geometry, sphere_material)
        vertex_mesh.position.copy(vertex_position)
        globe_mesh.add(vertex_mesh)

        const expected_position = convert_lat_lon_to_sphere(expected_lat_lon[0], expected_lat_lon[1], config.radius)
        vertex_meshes_and_expected_positions.push({ vertex_mesh, expected_position })

        // Show expected position as a green sphere
        const expected_sphere_geometry = new THREE.SphereGeometry(0.05, 16, 16)
        const expected_sphere_material = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.5 })
        const expected_vertex_mesh = new THREE.Mesh(expected_sphere_geometry, expected_sphere_material)
        expected_vertex_mesh.position.copy(expected_position)
        scene.add(expected_vertex_mesh)
    })

    const average_difference = calculate_average_difference(vertex_meshes_and_expected_positions)
    console.log("Average difference between the centre of our pentagons and H3's pentagons:", average_difference)

    let attempts_left = 1e4
    let step_size = 1e-1
    const min_step_size = 1e-20
    while (attempts_left-- > 0 && step_size > min_step_size)
    {
        const improvement = find_better_rotation(shared, step_size, vertex_meshes_and_expected_positions, globe_mesh, config)
        console.log("Improved by improvement:", improvement, " with step_size: ", step_size)
        if (improvement === 0) step_size *= 0.1
    }
    console.log("Rotation after gradient descent:", shared.rotation)
}


function calculate_average_difference(vertex_meshes_and_expected_positions: VertexMeshAndExpectedPosition[]): number
{
    const differences: THREE.Vector3[] = []

    vertex_meshes_and_expected_positions.forEach(({ vertex_mesh, expected_position }) =>
    {
        const sphere_world_position = new THREE.Vector3()
        vertex_mesh.getWorldPosition(sphere_world_position)

        const difference = new THREE.Vector3()

        difference.subVectors(sphere_world_position, expected_position)
        differences.push(difference)
    })

    const average = differences.reduce((acc, diff) => acc + diff.length(), 0) / differences.length
    return average
}


function find_better_rotation(shared: { rotation: THREE.Euler }, step_size: number, vertex_meshes_and_expected_positions: VertexMeshAndExpectedPosition[], globe_mesh: THREE.Mesh, _config: BasicIcosahedralGridConfig)
{
    const current_difference = calculate_average_difference(vertex_meshes_and_expected_positions)
    let best_new_difference = current_difference

    const axes: ("x" | "y" | "z")[] = ["x", "y", "z"]
    axes.forEach(axis => {
        ;[1, -1].forEach(direction =>
        {
            const new_rotation = shared.rotation.clone()
            new_rotation[axis] += direction * step_size

            globe_mesh.rotation.copy(new_rotation)
            globe_mesh.updateMatrixWorld(true)

            const new_difference = calculate_average_difference(vertex_meshes_and_expected_positions)
            if (new_difference < current_difference)
            {
                // console .debug(`New difference after rotating ${axis} by ${direction * delta}:`, new_difference, " current difference:", current_difference)
                best_new_difference = new_difference
                shared.rotation.copy(new_rotation)
            }
            else
            {
                // Reset rotation if it didn't improve
                globe_mesh.rotation.copy(shared.rotation.clone())
            }
        })
    })

    return current_difference - best_new_difference
}
