import * as THREE from "three"


/**
 * Subdivide triangles in a BufferGeometry if any edge is longer than a threshold, projecting new points onto a sphere.
 * @param {THREE.BufferGeometry} geometry - The geometry to subdivide (will be modified in place)
 * @param {number} radius - The radius of the sphere to project new points onto
 * @returns {void}
 */
export function subdivide_long_geometry_to_sphere(geometry: THREE.BufferGeometry, radius: number, country_name: string)
{
    // TODO, vary this threshold based on the radius of the sphere
    let long_edge_threshold = 0.3
    // Removes single artefacts
    if (country_name === "Mozambique") long_edge_threshold = 0.25
    // Removes all but one artefact
    if (country_name === "Russia") long_edge_threshold = 0.05

    let encountered_large_triangles
    do
    {
        const positions = geometry.attributes.position!.array
        const indices = geometry.index!.array

        const { new_positions, new_indices } = calculate_new_positions_and_indices(positions, indices, radius, long_edge_threshold)
        encountered_large_triangles = new_indices.length !== indices.length

        geometry.setAttribute("position", new THREE.Float32BufferAttribute(new_positions, 3))
        geometry.setIndex(new_indices)
    }
    while (encountered_large_triangles)
}


// Exported for testing
export function calculate_new_positions_and_indices(
    positions: THREE.TypedArray,
    indices: THREE.TypedArray,
    radius: number,
    long_edge_threshold: number
)
{
    const new_positions = [...positions]
    const new_indices: number[] = []

    function indices_to_edge_key(i: number, j: number)
    {
        return i < j ? `${i}-${j}` : `${j}-${i}`
    }

    const map_edge_to_midpoint = new Map<string, number | undefined>()
    for (let i = 0; i < indices.length; i += 3)
    {
        const ia = indices[i]!
        const ib = indices[i + 1]!
        const ic = indices[i + 2]!

        map_edge_to_midpoint.set(indices_to_edge_key(ia, ib), undefined)
        map_edge_to_midpoint.set(indices_to_edge_key(ib, ic), undefined)
        map_edge_to_midpoint.set(indices_to_edge_key(ic, ia), undefined)
    }


    function get_or_calculate_mid_point(index1: number, index2: number, vertex1: number[], vertex2: number[])
    {
        const key = indices_to_edge_key(index1, index2)
        const existing_midpoint_index = map_edge_to_midpoint.get(key)
        if (existing_midpoint_index !== undefined) return existing_midpoint_index

        // Calculate new midpoint vertex
        const mid_point = new THREE.Vector3(
            (vertex1[0]! + vertex2[0]!) / 2,
            (vertex1[1]! + vertex2[1]!) / 2,
            (vertex1[2]! + vertex2[2]!) / 2
        )
        // Normalize to sphere radius
        .normalize().multiplyScalar(radius)

        // Calculate what the new index for the new vertex will be
        const new_index = new_positions.length / 3

        // Add new vertex
        new_positions.push(mid_point.x, mid_point.y, mid_point.z)

        // Store new midpoint in map to reuse / avoid duplicates
        map_edge_to_midpoint.set(key, new_index)

        return new_index
    }


    for (let i = 0; i < indices.length; i += 3)
    {
        const ia = indices[i]!
        const ib = indices[i + 1]!
        const ic = indices[i + 2]!

        const a = ia * 3
        const b = ib * 3
        const c = ic * 3

        // Get vertices
        const va: number[] = [positions[a]!, positions[a + 1]!, positions[a + 2]!]
        const vb: number[] = [positions[b]!, positions[b + 1]!, positions[b + 2]!]
        const vc: number[] = [positions[c]!, positions[c + 1]!, positions[c + 2]!]

        // Check edge lengths
        const ab = new THREE.Vector3(va[0]! - vb[0]!, va[1]! - vb[1]!, va[2]! - vb[2]!).length()
        const bc = new THREE.Vector3(vb[0]! - vc[0]!, vb[1]! - vc[1]!, vb[2]! - vc[2]!).length()
        const ca = new THREE.Vector3(vc[0]! - va[0]!, vc[1]! - va[1]!, vc[2]! - va[2]!).length()

        if (ab < long_edge_threshold && bc < long_edge_threshold && ca < long_edge_threshold) {
            // If all edges are short, keep the triangle as is
            new_indices.push(ia, ib, ic)
            continue
        }

        // Get existing or add new midpoint and return new index
        const iMab = get_or_calculate_mid_point(ia, ib, va, vb)
        const iMbc = get_or_calculate_mid_point(ib, ic, vb, vc)
        const iMca = get_or_calculate_mid_point(ic, ia, vc, va)

        // Create 4 new triangles
        new_indices.push(indices[i]!, iMab, iMca)
        new_indices.push(iMab, indices[i + 1]!, iMbc)
        new_indices.push(iMca, iMbc, indices[i + 2]!)
        new_indices.push(iMab, iMbc, iMca)
    }

    const new_indices_with_neighbours_split: number[] = []

    function split_triangle_using_existing_midpoints(
        index1: number, index2: number, index3: number,
        mid1: number | undefined, mid2: number | undefined, mid3: number | undefined
    )
    {
        const splits_needed = (
            (mid1 !== undefined ? 1 : 0)
            + (mid2 !== undefined ? 1 : 0)
            + (mid3 !== undefined ? 1 : 0)
        )

        if (splits_needed === 0)
        {
            // No splits are needed, i.e. this triangle's edges have no
            // new midpoints present so we do not need to split this triangle
            // at all and we can just add it as is
            new_indices_with_neighbours_split.push(index1, index2, index3)
            return
        }

        if (splits_needed === 3)
        {
            // All edges have new midpoints, so we can split this triangle
            // into 4 triangles using the new midpoints
            new_indices_with_neighbours_split.push(index1, mid1!, mid3!)
            new_indices_with_neighbours_split.push(mid1!, index2, mid2!)
            new_indices_with_neighbours_split.push(mid3!, mid2!, index3)
            new_indices_with_neighbours_split.push(mid1!, mid2!, mid3!)
            return
        }

        if (splits_needed === 1)
        {
            // If only one edge has a new midpoint, we can just split this
            // triangle into 2 triangles
            if (mid1 !== undefined)
            {
                new_indices_with_neighbours_split.push(index1, mid1, index3)
                new_indices_with_neighbours_split.push(mid1, index2, index3)
                return
            }
            if (mid2 !== undefined)
            {
                new_indices_with_neighbours_split.push(index1, index2, mid2)
                new_indices_with_neighbours_split.push(mid2, index3, index1)
                return
            }
            if (mid3 !== undefined)
            {
                new_indices_with_neighbours_split.push(index1, index2, mid3)
                new_indices_with_neighbours_split.push(index2, index3, mid3)
                return
            }
        }

        // Split twice into 3 triangles using the new midpoint
        if (mid1 !== undefined)
        {
            if (mid3 !== undefined)
            {
                new_indices_with_neighbours_split.push(index1, mid1, mid3)
                new_indices_with_neighbours_split.push(mid1, index3, mid3)
                new_indices_with_neighbours_split.push(mid1, index2, index3)
            }
            else
            {
                new_indices_with_neighbours_split.push(index1, mid1, index3)
                new_indices_with_neighbours_split.push(mid1, index2, mid2!)
                new_indices_with_neighbours_split.push(mid1, mid2!, index3)
            }
            return
        }

        new_indices_with_neighbours_split.push(index1, index2, mid2!)
        new_indices_with_neighbours_split.push(index1, mid2!, mid3!)
        new_indices_with_neighbours_split.push(mid2!, index3, mid3!)
    }

    // Check if any of the new indices are using an edge which has now been
    // subdivided
    for (let i = 0; i < new_indices.length; i += 3)
    {
        const ia = new_indices[i]!
        const ib = new_indices[i + 1]!
        const ic = new_indices[i + 2]!

        const edge_key1 = indices_to_edge_key(ia, ib)
        const edge_key2 = indices_to_edge_key(ib, ic)
        const edge_key3 = indices_to_edge_key(ic, ia)

        const mid1 = map_edge_to_midpoint.get(edge_key1)
        const mid2 = map_edge_to_midpoint.get(edge_key2)
        const mid3 = map_edge_to_midpoint.get(edge_key3)

        split_triangle_using_existing_midpoints(ia, ib, ic, mid1, mid2, mid3)
    }

    return { new_positions, new_indices: new_indices_with_neighbours_split }
}
