import { LatLonOnly } from "./interface"


const d2r = Math.PI / 180  // Degrees to radians conversion factor

export function haversine_distance(a: LatLonOnly, b: LatLonOnly): number
{
    const R = 6371 // Earth's radius in kilometers
    const diff_lat_radians = (b.lat - a.lat) * d2r
    const d_lon_radians = (b.lon - a.lon) * d2r
    const c = Math.pow(Math.sin(diff_lat_radians / 2), 2) +
              Math.cos(a.lat * d2r) * Math.cos(b.lat * d2r) *
              Math.pow(Math.sin(d_lon_radians / 2), 2)
    const d = 2 * Math.atan2(Math.sqrt(c), Math.sqrt(1 - c))
    return R * d
}
