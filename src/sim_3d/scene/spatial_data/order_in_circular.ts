import { ILatLon } from "core/data/values/LatLon"


export function order_in_circular(spatial_data: ILatLon[], indices_to_order: number[]): number[]
{
    const elements = indices_to_order.map(index => ({
        ...spatial_data[index]!,
        original_index: index,
        angle_to_center: 0, // will be calculated later
    }))
    if (elements.length === 0) return []

    const first_element = elements[0]!

    const center = elements.slice(1).reduce((acc, el) => ({
        lat: acc.lat + el.lat,
        lon: acc.lon + el.lon,
    }), { lat: first_element.lat, lon: first_element.lon })
    center.lat /= elements.length
    center.lon /= elements.length

    // Angle from center to each element
    elements.forEach(el => {
        const lat_diff = el.lat - center.lat
        const lon_diff = el.lon - center.lon
        el.angle_to_center = Math.atan2(lon_diff, lat_diff) // atan2 gives angle in radians
    })

    // Sort elements by angle
    elements.sort((a, b) => a.angle_to_center > b.angle_to_center ? 1 : -1)

    // Return the ordered indices
    return elements.map(el => el.original_index)
}
