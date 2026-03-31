import * as THREE from "three"


export function calculate_triangle_areas(geometry: THREE.BufferGeometry): number[]
{
    const position_attribute = geometry.getAttribute("position") as THREE.BufferAttribute
    const areas: number[] = []

    const v1 = new THREE.Vector3()
    const v2 = new THREE.Vector3()
    const v3 = new THREE.Vector3()

    // Non-indexed geometry: every 3 consecutive vertices form a triangle
    for (let i = 0; i < position_attribute.count; i += 3)
    {
        v1.fromBufferAttribute(position_attribute, i)
        v2.fromBufferAttribute(position_attribute, i + 1)
        v3.fromBufferAttribute(position_attribute, i + 2)

        const edge1 = v2.clone().sub(v1)
        const edge2 = v3.clone().sub(v1)
        const area = edge1.cross(edge2).length() / 2
        areas.push(area)
    }

    return areas
}


const EARTH_RADIUS = 6371 // in km
const EARTH_SURFACE_AREA = 4 * Math.PI * EARTH_RADIUS * EARTH_RADIUS // in km^2
// TODO: this is wrong because it does not take into account the curvature of
// the Earth and so reports areas as smaller than they are due to treating them
// as flat polygons.
export function area_of_polygon_in_km2(polygon: THREE.Vector3[], earth_arbitrary_area: number): number
{
    if (polygon.length < 3) return 0

    let area = 0
    const n = polygon.length

    for (let i = 0; i < n; i++)
    {
        const j = (i + 1) % n
        area += polygon[i]!.x * polygon[j]!.y - polygon[j]!.x * polygon[i]!.y
    }

    area = Math.abs(area) / 2

    return (area / earth_arbitrary_area) * EARTH_SURFACE_AREA
}


type Polygon = THREE.Vector3[]

class Edge
{
    constructor(public index_a: number, public index_b: number) {}

    toString(): string
    {
        return this.index_a < this.index_b ? `${this.index_a}_${this.index_b}` : `${this.index_b}_${this.index_a}`
    }
}


export function split_into_pent_and_hexagons(geometry: THREE.BufferGeometry): { pentagons: Polygon[], hexagons: Polygon[] }
{
    console.warn("split_into_pent_and_hexagons is not fully implemented yet")
    const index = geometry.index
    if (!index)
    {
        throw new Error("Geometry must be indexed to split into polygons")
    }
    const position_attribute = geometry.getAttribute("position") as THREE.BufferAttribute

    const map_vertex_to_edge: Map<number, Edge[]> = new Map()
    const faces: number[][] = []
    // Map of edges -> faces sharing them
    const map_edge_to_face_index = new Map<string, {edge: Edge, face_indices: number[]}>()
    function add_edge(index_a: number, index_b: number, face_index: number)
    {
        const edge = new Edge(index_a, index_b)
        if (!map_edge_to_face_index.has(edge.toString())) map_edge_to_face_index.set(edge.toString(), {edge, face_indices: []})
        map_edge_to_face_index.get(edge.toString())!.face_indices.push(face_index)

        if (!map_vertex_to_edge.has(index_a)) map_vertex_to_edge.set(index_a, [])
        if (!map_vertex_to_edge.has(index_b)) map_vertex_to_edge.set(index_b, [])
        if (!map_vertex_to_edge.get(index_a)!.find(e => e.index_b === index_b || e.index_a === index_b))
        {
            // Edge not already present in list for this vertex
            map_vertex_to_edge.get(index_a)!.push(edge)
        }
        if (!map_vertex_to_edge.get(index_b)!.find(e => e.index_b === index_a || e.index_a === index_a))
        {
            // Edge not already present in list for this vertex
            map_vertex_to_edge.get(index_b)!.push(edge)
        }
    }

    for(let i = 0; i < index.count; i += 3)
    {
        const index_x = index.getX(i)
        const index_y = index.getX(i + 1)
        const index_z = index.getX(i + 2)

        const face_index = faces.length
        const face = [index_x, index_y, index_z]
        faces.push(face)

        add_edge(index_x, index_y, face_index)
        add_edge(index_y, index_z, face_index)
        add_edge(index_z, index_x, face_index)
    }

    // Merge triangles into polygons
    const visited_faces = new Set<number>()
    const polygons: number[][] = []

    const pentagons: Polygon[] = []
    const hexagons: Polygon[] = []
    const used_faces = new Set<number>()

    map_vertex_to_edge.forEach((edges, vertex_index) =>
    {
        if (edges.length === 5)
        {
            // Pentagon
            const pentagon: Polygon = []
            const vertices_boundary: number[] = []
            edges.forEach(edge =>
            {
                const other_vertex = edge.index_a === vertex_index ? edge.index_b : edge.index_a
                vertices_boundary.push(other_vertex)
                const vertex = new THREE.Vector3().fromBufferAttribute(position_attribute, other_vertex)
                // This won't work as vertex might not be in the right order
                pentagon.push(vertex)
            })
            pentagons.push(pentagon)

            // Mark faces as used
            // Would need to go from the list of vertices around the pentagon
            // and the central vertex, to finding which sets of 3 vertices form
            // each of the faces, and then marking those as used.
        }
    })

    return { pentagons, hexagons }
}
