import { to_radians } from "./angles"
import { LatLonOnly } from "./interface"


// Returns initial bearing in radians from point1 to point2 on a sphere
export function initial_bearing(from: LatLonOnly, to: LatLonOnly): number
{
    const theta1 = to_radians(from.lat)
    const theta2 = to_radians(to.lat)
    const lon_diff = to_radians(to.lon - from.lon)

    const y = Math.sin(lon_diff) * Math.cos(theta2)
    const x = Math.cos(theta1) * Math.sin(theta2) -
              Math.sin(theta1) * Math.cos(theta2) * Math.cos(lon_diff)
    return Math.atan2(y, x)
}
