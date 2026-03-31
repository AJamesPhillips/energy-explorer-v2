import { ILatLon } from "core/data/values/LatLon"

import { haversine_distance } from "../../utils/geo/haversine_distance"


interface WithNearest
{
    nearest: number[] // indices of nearest neighbours
}

interface WithIndex
{
    original_index: number
}


export function find_nearest_neighbours<V extends ILatLon>(spatial_data_grid: V[], threshold: number): (WithNearest & V)[]
{
    if (spatial_data_grid.length === 0) return []

    // Create indexed points for tracking original positions
    const {
        indexed_points,
        lat_sorted,
    } = get_indexed_points(spatial_data_grid)

    // For each point, find neighbors within threshold
    for (let i = 0; i < lat_sorted.length; i++)
    {
        const current = lat_sorted[i]!
        const neighbors = get_lat_lon_neighbors(i, current, lat_sorted, threshold)
        current.nearest = neighbors
    }

    return indexed_points
}


function get_indexed_points<V extends ILatLon>(spatial_data_grid: V[])
{
    const indexed_points: (V & WithIndex & WithNearest)[] = spatial_data_grid.map((point, index) => ({
        ...point,
        original_index: index,
        nearest: [], // will be filled later
    }))

    // Sort by latitude
    const lat_sorted = [...indexed_points].sort((a, b) => a.lat - b.lat)

    return { indexed_points, lat_sorted }
}


function get_lat_lon_neighbors<V extends ILatLon>(i: number, current: (V & WithIndex), lat_sorted: (V & WithIndex)[], threshold: number): number[]
{
    const lat_lon_neighbors: number[] = []

    // Search backward (lower latitudes)
    for (let j = i - 1; j >= 0; j--)
    {
        const candidate = lat_sorted[j]!

        const lat_distance = current.lat - candidate.lat
        // No need to check further back if the distance exceeds threshold
        if (lat_distance > threshold) break
        if (haversine_distance(current, candidate) > threshold) continue
        lat_lon_neighbors.push(candidate.original_index)
    }

    // Search forward (higher latitudes)
    for (let j = i + 1; j < lat_sorted.length; j++)
    {
        const candidate = lat_sorted[j]!

        const lat_distance = candidate.lat - current.lat
        // No need to check further back if the distance exceeds threshold
        if (lat_distance > threshold) break
        if (haversine_distance(current, candidate) > threshold) continue
        lat_lon_neighbors.push(candidate.original_index)
    }

    return lat_lon_neighbors
}
