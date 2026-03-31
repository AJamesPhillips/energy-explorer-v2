import { ILatLon } from "core/data/values/LatLon"

import { angle_difference } from "../../utils/geo/angles"
import { destination_point } from "../../utils/geo/destination_point"
import { haversine_distance } from "../../utils/geo/haversine_distance"
import { initial_bearing } from "../../utils/geo/initial_bearing"


const degrees_fudge = 5 // accommodate for some error in the angles
const d2r = Math.PI / 180  // Degrees to radians conversion factor

/**
 * Should also handle pentagons
 */
export function find_hex_grid_mid_points(
    central: ILatLon,
    spatial_data: ILatLon[],
    ordered_indices: number[],
    fill_in_missing_neighbours?: boolean
): ILatLon[] | undefined
{
    const elements = ordered_indices.map(index => spatial_data[index]!)
    if (elements.length < 2) return []

    let total_angle_covered = 0
    const mid_points: ILatLon[] = []
    // See test "should handle only 2 neighbours" for why `iter_element_count` is needed
    const iter_element_count = elements.length === 2 ? 1 : elements.length
    for (let i = 0; i < iter_element_count; ++i)
    {
        const el1 = elements[i]!
        const el2 = elements[(i + 1) % elements.length]!

        const angle_to_el1 = initial_bearing(central, el1)
        const angle_to_el2 = initial_bearing(central, el2)
        const angle_covered = angle_difference(angle_to_el1, angle_to_el2)

        // 72 allows for the occasional pentagon in the normally hexagonal grid
        if (angle_covered > ((72 + degrees_fudge) * d2r))
        {
            // We're missing a neigbour so
            // but if we don't want to attempt to fill in missing neighbours
            // then we just return undefined
            if (!fill_in_missing_neighbours) return undefined
            // otherwise if we've already got one mid point we bail out of this
            // loop now and guess the other neighbours & corresponding mid points
            if (mid_points.length > 0) break
            // Otherwise, skip this point
            else continue
        }

        total_angle_covered += angle_covered

        const mid_point: ILatLon = {
            lat: (central.lat + el1.lat + el2.lat) / 3,
            lon: (central.lon + el1.lon + el2.lon) / 3,
        }
        mid_points.push(mid_point)
    }

    if (total_angle_covered < ((360 - degrees_fudge) * d2r))
    {
        // We're at an edge so we're missing some neighbours and need to fill
        // in the rest of the mid points.  This might be a hexagon or a pentagon
        // so we need to add the rest of the points with similar angles
        const average_angle = total_angle_covered / mid_points.length
        const angle_increment = calc_angle_increment(average_angle, total_angle_covered)
        const last_mid_point = mid_points[mid_points.length - 1]
        if (!last_mid_point) return undefined
        let angle_to_last = initial_bearing(central, last_mid_point)
        const distance_to_last = haversine_distance(central, last_mid_point)
        let new_angle = angle_to_last // initialise to the last angle

        while (total_angle_covered < ((360 - degrees_fudge) * d2r))
        {
            new_angle += angle_increment
            const new_mid_point: ILatLon = destination_point(central, new_angle, distance_to_last)

            mid_points.push(new_mid_point)
            total_angle_covered += angle_increment
        }
    }

    return mid_points
}


function calc_angle_increment(average_angle: number, total_angle_covered: number): number
{
    const angle_remaining = Math.PI * 2 - total_angle_covered
    const multiples = Math.round(angle_remaining / average_angle)
    if (multiples === 0) return average_angle
    return angle_remaining / multiples
}
