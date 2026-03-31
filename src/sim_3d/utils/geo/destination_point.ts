import { to_radians } from "./angles"
import { LatLonOnly } from "./interface"


export function destination_point(start: LatLonOnly, bearing: number, distance: number): LatLonOnly
{
    const radius = 6371 // Earth's radius in kilometers
    const theta1 = to_radians(start.lat)
    const gamma1 = to_radians(start.lon)

    const delta = distance / radius // angular distance in radians

    const theta2 = Math.asin(
        Math.sin(theta1) * Math.cos(delta) +
        Math.cos(theta1) * Math.sin(delta) * Math.cos(bearing)
    )
    const gamma2 = gamma1 + Math.atan2(
        Math.sin(bearing) * Math.sin(delta) * Math.cos(theta1),
        Math.cos(delta) - Math.sin(theta1) * Math.sin(theta2)
    )

    return {
        lat: theta2 * 180 / Math.PI,
        lon: gamma2 * 180 / Math.PI,
    }
}
